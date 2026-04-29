# OAuth Troubleshooting Guide

## Common Errors and Solutions

### "An error occurred with Google sign-in"

This is a generic error. Check the browser console for more details.

**Common Causes:**

#### 1. **Supabase Not Configured**
**Error**: "OAuth is only available with Supabase configuration"

**Solution**:
- Create `.env` file in project root
- Add your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- Restart dev server: `npm run dev`

#### 2. **Google Provider Not Enabled in Supabase**
**Error**: "Provider not enabled" or similar

**Solution**:
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and toggle to **Enabled**
3. Enter your Google OAuth credentials
4. Click **Save**

#### 3. **Missing Google OAuth Credentials**
**Error**: "Invalid client" or "unauthorized_client"

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

#### 4. **Redirect URI Mismatch**
**Error**: "redirect_uri_mismatch"

**Solution**:
- In Google Cloud Console, verify redirect URI exactly matches:
  `https://your-project-id.supabase.co/auth/v1/callback`
- No trailing slashes
- Must be HTTPS (except localhost)

#### 5. **Migration Not Run**
**Error**: Column "oauth_provider" does not exist

**Solution**:
1. Go to Supabase → **SQL Editor**
2. Run `supabase/migrations/002_oauth_support.sql`
3. Verify success

#### 6. **CORS Issues**
**Error**: "CORS policy" or "blocked by CORS"

**Solution**:
- Add your domain to authorized origins in Google Cloud Console
- For development: `http://localhost:5173`
- For production: `https://yourdomain.com`

## Debugging Steps

### Step 1: Check Browser Console
Open browser DevTools (F12) and check Console tab for detailed error messages.

### Step 2: Verify Environment Variables
```javascript
// Add this temporarily to Login.jsx
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Step 3: Check Supabase Connection
```javascript
import { isSupabaseConfigured } from './src/config/supabase';
console.log('Supabase configured:', isSupabaseConfigured());
```

### Step 4: Test Auth Context
```javascript
const { useSupabase, loginWithGoogle } = useAuth();
console.log('Using Supabase:', useSupabase);
console.log('Has loginWithGoogle:', typeof loginWithGoogle === 'function');
```

### Step 5: Check Network Tab
1. Open DevTools → Network tab
2. Click "Continue with Google"
3. Look for failed requests
4. Check response for error details

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "OAuth is only available with Supabase" | No `.env` file | Create `.env` with credentials |
| "Supabase is not configured" | Invalid credentials | Check `.env` values |
| "redirect_uri_mismatch" | Wrong redirect URI | Update Google Console |
| "unauthorized_client" | Invalid Client ID | Check Google credentials |
| "access_denied" | User cancelled | Normal - user chose not to sign in |
| "Provider not enabled" | Google not enabled in Supabase | Enable in Supabase Dashboard |

## Testing Checklist

- [ ] `.env` file exists with valid credentials
- [ ] Dev server restarted after creating `.env`
- [ ] Google provider enabled in Supabase
- [ ] Google OAuth credentials configured
- [ ] Redirect URI matches exactly
- [ ] Migration `002_oauth_support.sql` run successfully
- [ ] `/auth/callback` route added to App.jsx
- [ ] Browser console shows no errors
- [ ] Network tab shows successful OAuth redirect

## Still Having Issues?

### Check Supabase Logs
1. Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for failed authentication attempts
3. Check error messages

### Verify Database Tables
1. Supabase → **Table Editor** → `profiles`
2. Check if `oauth_provider` column exists
3. If not, run migration again

### Test with Mock Auth
If Supabase isn't working, test without it:
1. Remove or rename `.env` file
2. Restart dev server
3. App should fall back to localStorage mode
4. "Continue with Google" should use demo login

### Enable Detailed Logging
Add to `src/services/supabaseAuthService.js`:
```javascript
async loginWithGoogle(redirectTo) {
  console.log('Starting Google OAuth...');
  console.log('Redirect to:', redirectTo);
  
  // ... existing code
  
  console.log('OAuth result:', { success: result.success, error: result.error });
  return result;
}
```

## Production Issues

### HTTPS Required
- OAuth requires HTTPS in production
- Localhost can use HTTP for development
- Use Netlify, Vercel, or similar for free HTTPS

### Environment Variables
- Ensure production `.env` is set
- Different from development credentials
- Never commit `.env` to git

### Domain Whitelisting
- Add production domain to Google Console
- Add to Supabase allowed redirect URLs
- Update both authorized origins and redirect URIs

## Contact Support

If none of these solutions work:
1. Check [Supabase Discord](https://discord.supabase.com)
2. Review [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
3. Check [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
4. Create issue in project repository with:
   - Error message
   - Browser console logs
   - Network tab screenshots
   - Steps to reproduce
