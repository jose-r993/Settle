# Fix: Infinite Recursion in RLS Policies

## Problem
The error `infinite recursion detected in policy for relation "profiles"` occurs because the admin policy checks if a user is an admin by querying the same `profiles` table it's protecting, creating a circular dependency.

## Solution
Run the new migration that creates a `SECURITY DEFINER` function to break the recursion.

## Steps to Fix

### 1. Run the Fix Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy the contents of `supabase/migrations/003_fix_rls_policies.sql`
5. Paste into the editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

### 2. Verify the Fix

After running the migration, check:

1. **SQL Editor** → Run this query:
```sql
SELECT * FROM auth_config;
```

If it returns 4 rows without error, the fix worked!

2. **Test in your app**:
- Refresh your browser
- Check browser console - the error should be gone
- Try logging in

## What the Fix Does

### Creates a Safe Admin Check Function
```sql
CREATE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

The `SECURITY DEFINER` flag allows the function to bypass RLS, preventing recursion.

### Updates Policies to Use the Function
```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    public.is_admin(auth.uid())
  );
```

Now the policy uses the function instead of directly querying `profiles`.

## Alternative: Manual Fix via Dashboard

If you prefer to fix it manually:

1. **Drop the problematic policy**:
```sql
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
```

2. **Create the function**:
```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

3. **Recreate the policy**:
```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    public.is_admin(auth.uid())
  );
```

4. **Grant permissions**:
```sql
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;
```

## Verification

After applying the fix, your app should:
- ✅ Load auth config from Supabase without errors
- ✅ Allow users to view their own profiles
- ✅ Allow admins to view all profiles
- ✅ No infinite recursion errors in console

## Why This Happened

The original policy:
```sql
USING (
  EXISTS (
    SELECT 1 FROM public.profiles  -- ❌ Queries the same table
    WHERE id = auth.uid() AND role = 'admin'
  )
)
```

This creates recursion because:
1. User tries to read from `profiles`
2. RLS policy checks if user is admin
3. To check admin status, it reads from `profiles`
4. This triggers RLS again → infinite loop

The fix uses `SECURITY DEFINER` which executes with the function owner's privileges, bypassing RLS and breaking the cycle.

## Still Having Issues?

If you still see errors after running the migration:

1. **Check Supabase logs**: Dashboard → Logs → Postgres Logs
2. **Verify function exists**: 
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'is_admin';
```
3. **Check policy exists**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

**Run `003_fix_rls_policies.sql` in Supabase SQL Editor to fix this issue.**
