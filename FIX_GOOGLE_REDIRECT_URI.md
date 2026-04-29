# Fix: Google OAuth Redirect URI Error

## Error Message
```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
Request details: redirect_uri=https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback
```

## Problem
The redirect URI is not registered in Google Cloud Console.

## Solution (2 minutes)

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com
2. Select your project (or create one if needed)

### Step 2: Navigate to OAuth Credentials

1. Click **APIs & Services** in the left menu
2. Click **Credentials**
3. Find your OAuth 2.0 Client ID (or create one if it doesn't exist)
4. Click the **pencil icon** to edit

### Step 3: Add the Redirect URI

In the **Authorized redirect URIs** section, add this EXACT URL:

```
https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback
```

**Important:**
- ✅ Use HTTPS (not HTTP)
- ✅ No trailing slash
- ✅ Exact match - copy/paste to avoid typos
- ✅ Include `/auth/v1/callback` at the end

### Step 4: Also Add Development URI (Optional)

For local testing, also add:
```
http://localhost:5173/auth/callback
```

### Step 5: Save

1. Click **Save** at the bottom
2. Wait 5-10 seconds for changes to propagate

### Step 6: Test

1. Go back to your app
2. Click "Continue with Google"
3. Should now redirect to Google sign-in successfully

## If You Don't Have OAuth Credentials Yet

### Create OAuth 2.0 Client ID

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: **Settle**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** through all steps
4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Settle Web Client**
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - Your production domain (if any)
   - Authorized redirect URIs:
     - `https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback`
5. Click **Create**
6. **Copy the Client ID and Client Secret**

### Add Credentials to Supabase

1. Go to **Supabase Dashboard**
2. **Authentication** → **Providers** → **Google**
3. Toggle **Enabled**
4. Paste **Client ID**
5. Paste **Client Secret**
6. Click **Save**

## Verification Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URI added: `https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied
- [ ] Credentials added to Supabase
- [ ] Google provider enabled in Supabase
- [ ] Tested "Continue with Google" button

## Common Mistakes

### ❌ Wrong redirect URI format
```
https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback/  ← Extra slash
https://lvthebjxcdiwbceeyqje.supabase.co/callback          ← Missing /auth/v1
http://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback   ← HTTP instead of HTTPS
```

### ✅ Correct format
```
https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback
```

## Still Having Issues?

### Error: "redirect_uri_mismatch"
- Double-check the URI in Google Console matches exactly
- No extra spaces or characters
- Wait 30 seconds after saving for changes to propagate

### Error: "Access blocked: This app's request is invalid"
- Configure OAuth consent screen
- Add your email as a test user
- Ensure app is in "Testing" mode (not "Production" yet)

### Error: "unauthorized_client"
- Verify Client ID and Secret are correct in Supabase
- Check for extra spaces when copying/pasting
- Regenerate credentials if needed

## Quick Reference

**Your Supabase Project ID:** `lvthebjxcdiwbceeyqje`

**Your Callback URL:** `https://lvthebjxcdiwbceeyqje.supabase.co/auth/v1/callback`

**Google Cloud Console:** https://console.cloud.google.com

**Supabase Dashboard:** https://app.supabase.com

---

**Add the redirect URI to Google Cloud Console to fix this error.**
