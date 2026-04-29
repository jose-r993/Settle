# Debug: Blank Screen After Authentication

## Quick Checks

### 1. Check Browser Console (F12)
Open DevTools and look for errors. Common issues:

**If you see:**
```
infinite recursion detected in policy for relation "profiles"
```
**Fix:** Run `003_fix_rls_policies.sql` in Supabase SQL Editor

**If you see:**
```
Failed to load auth config
```
**Fix:** Check `.env` file has correct Supabase credentials

**If you see:**
```
Cannot read properties of undefined
```
**Fix:** Auth state not loading properly - see below

### 2. Verify Migrations Applied

Go to Supabase → SQL Editor and run:
```sql
-- Check if is_admin function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- Should return 1 row
```

If no results, run `003_fix_rls_policies.sql`

### 3. Check Auth State in Console

Add this temporarily to `AuthCallback.jsx` at line 11:
```javascript
console.log('AuthCallback state:', { user, loading, hasUser: !!user });
```

Refresh and check what it logs.

## Common Causes & Fixes

### Issue 1: Auth State Not Updating
**Symptom:** Blank screen, console shows `user: null` forever

**Fix:**
1. Clear browser localStorage: DevTools → Application → Local Storage → Clear All
2. Refresh page
3. Try logging in again

### Issue 2: Navigation Not Triggering
**Symptom:** Loading spinner shows but never navigates

**Debug:** Add to `AuthCallback.jsx` line 33:
```javascript
console.log('About to navigate:', isNewUser ? '/preferences' : '/dashboard');
```

If you see the log but no navigation, the `onNavigate` function might not be working.

### Issue 3: Supabase Session Not Created
**Symptom:** Google OAuth completes but user is null

**Check:** Supabase Dashboard → Authentication → Users
- Is the user created?
- If yes: Session issue
- If no: Trigger/migration issue

**Fix if user exists but session doesn't:**
```javascript
// Add to SupabaseAuthContext.jsx line 34
console.log('Auth event:', event, 'User:', !!formattedUser, 'Session:', !!session);
```

### Issue 4: RLS Policies Blocking
**Symptom:** User created but can't read their own profile

**Test:** Supabase SQL Editor:
```sql
-- Test as your user
SELECT * FROM profiles WHERE id = auth.uid();
```

If this fails, RLS policies are wrong.

**Fix:** Run all migrations in order:
1. `001_initial_schema.sql`
2. `002_oauth_support.sql`
3. `003_fix_rls_policies.sql`

## Step-by-Step Debug Process

### Step 1: Clear Everything
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Enable Verbose Logging

Add to `src/pages/AuthCallback.jsx`:
```javascript
useEffect(() => {
  console.log('=== AuthCallback Mount ===');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  
  // ... rest of useEffect
}, [user, loading, onNavigate]);
```

### Step 3: Test OAuth Flow

1. Click "Continue with Google"
2. Authorize
3. Watch console logs
4. Note where it stops

**Expected logs:**
```
Auth state changed: SIGNED_IN true
AuthCallback state: { user: {...}, loading: false, hasUser: true }
About to navigate: /dashboard
```

### Step 4: Check Network Tab

1. DevTools → Network tab
2. Click "Continue with Google"
3. Look for failed requests (red)
4. Check response of `/rest/v1/profiles` or `/auth/v1/user`

## Manual Fixes

### If User Stuck on Callback Page

**Quick fix - force navigation:**
```javascript
// In browser console while on /auth/callback
window.history.pushState({}, '', '/dashboard');
window.dispatchEvent(new PopStateEvent('popstate'));
```

### If Auth State Not Loading

**Force reload auth:**
```javascript
// In browser console
localStorage.removeItem('settle_user');
localStorage.removeItem('settle_token');
location.href = '/login';
```

### If Supabase Session Exists But User Null

**Check session:**
```javascript
// In browser console
const session = JSON.parse(localStorage.getItem('sb-lvthebjxcdiwbceeyqje-auth-token'));
console.log('Session:', session);
```

If session exists but user is null, there's a profile fetch issue.

## Create Minimal Test

Create `src/pages/TestAuth.jsx`:
```javascript
import { useAuth } from '../context/SupabaseAuthContext';

export default function TestAuth() {
  const auth = useAuth();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Auth Debug</h1>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </div>
  );
}
```

Add route in `App.jsx`:
```javascript
case '/test-auth': return <TestAuth onNavigate={navigate} />;
```

Navigate to `/test-auth` and see what auth state shows.

## Still Not Working?

### Collect Debug Info

Run in browser console:
```javascript
console.log({
  url: window.location.href,
  localStorage: Object.keys(localStorage),
  user: JSON.parse(localStorage.getItem('settle_user') || 'null'),
  supabaseSession: localStorage.getItem('sb-lvthebjxcdiwbceeyqje-auth-token')?.substring(0, 50),
});
```

Share this output for more specific help.

### Check Supabase Logs

1. Supabase Dashboard → Logs
2. Select "Auth Logs"
3. Look for failed authentication attempts
4. Check error messages

### Nuclear Option - Reset Everything

```sql
-- In Supabase SQL Editor
-- WARNING: Deletes all users and data

DELETE FROM favorites;
DELETE FROM saved_searches;
DELETE FROM notification_settings;
DELETE FROM user_preferences;
DELETE FROM profiles;

-- Then re-run all migrations
```

## What Should Happen

**Correct OAuth Flow:**
1. Click Google button → Redirect to Google
2. Authorize → Redirect to `/auth/callback`
3. AuthCallback shows loading (0.5-2 seconds)
4. User object populates
5. Navigate to `/dashboard`
6. Dashboard loads with user data

**Total time:** 2-5 seconds

If it takes longer than 5 seconds or shows blank screen, something is wrong.

---

**Try these steps and let me know what you see in the console.**
