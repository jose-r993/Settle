# Enable Google OAuth Provider in Supabase

## Error
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means Google OAuth is not enabled in your Supabase project.

## Quick Fix (2 minutes)

### Step 1: Enable Google Provider in Supabase

1. Go to your **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Providers**
5. Scroll down to find **Google**
6. Toggle the switch to **Enabled**

### Step 2: Configure Google OAuth Credentials

You need Google OAuth credentials. If you don't have them yet:

#### Option A: Use Supabase's Development Credentials (Quick Test)
Some Supabase projects have test credentials enabled by default. Just toggle Google to "Enabled" and save.

#### Option B: Create Your Own Google OAuth Credentials (Recommended)

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select a Project**
3. **Enable Google+ API**:
   - APIs & Services → Library
   - Search "Google+ API"
   - Click Enable

4. **Create OAuth Credentials**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: **Web application**
   - Name: `Settle`

5. **Configure Authorized Redirect URIs**:
   - Get your Supabase callback URL from the Supabase Providers page
   - It looks like: `https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback`
   - Add this EXACT URL to "Authorized redirect URIs"
   - Also add for development: `http://localhost:5173/auth/callback`

6. **Copy Credentials**:
   - Copy the **Client ID**
   - Copy the **Client Secret**

7. **Add to Supabase**:
   - Back in Supabase → Authentication → Providers → Google
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click **Save**

### Step 3: Test

1. Refresh your app
2. Click "Continue with Google"
3. Should redirect to Google sign-in

## Detailed Instructions

See `docs/GOOGLE_OAUTH_SETUP.md` for complete step-by-step instructions with screenshots.

## Quick Test Without Google Credentials

If you want to test the app without setting up Google OAuth:

1. **Don't enable Google provider** in Supabase
2. The app will automatically fall back to demo login
3. "Continue with Google" will log you in as `demo@settle.com`

## Troubleshooting

### "redirect_uri_mismatch"
- Verify the redirect URI in Google Console matches Supabase exactly
- Format: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
- No trailing slashes

### "unauthorized_client"
- Check Client ID and Secret are correct
- Ensure they're pasted into Supabase without extra spaces

### Still getting "provider is not enabled"
- Make sure you clicked **Save** in Supabase after enabling
- Wait 30 seconds and try again
- Clear browser cache
- Check Supabase logs: Dashboard → Logs → Auth Logs

## Your Supabase Callback URL

Based on your error, your Supabase URL is:
```
https://lvthebjxcdiwbceeyqje.supabase.co
```

So your callback URL should be:
```
https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback
```

Use this EXACT URL in Google Cloud Console.

## Next Steps

1. ✅ Run migration `003_fix_rls_policies.sql` (if not done)
2. ✅ Enable Google provider in Supabase
3. ✅ Add Google OAuth credentials
4. ✅ Test login

---

**Enable Google in Supabase Dashboard → Authentication → Providers to fix this error.**
