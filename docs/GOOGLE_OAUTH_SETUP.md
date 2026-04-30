# Google OAuth Setup Guide

## Overview

This guide will walk you through setting up Google OAuth authentication for your Settle application using Supabase.

## Prerequisites

- Supabase project set up (see `SUPABASE_SETUP.md`)
- Google Cloud Console account
- Your application's redirect URL

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google+ API

1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

### 1.3 Create OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Settle
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **Save and Continue**
6. On the **Scopes** page, click **Add or Remove Scopes**
7. Add these scopes:
   - `userinfo.email`
   - `userinfo.profile`
8. Click **Save and Continue**
9. Add test users (optional for development)
10. Click **Save and Continue**

### 1.4 Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Fill in:
   - **Name**: Settle Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - Your production domain (e.g., `https://settle.app`)
   - **Authorized redirect URIs**:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - Get this from Supabase (see Step 2)
5. Click **Create**
6. **Copy the Client ID and Client Secret** - you'll need these!

## Step 2: Configure Supabase

### 2.1 Get Your Supabase Redirect URL

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find the **Google** provider
4. Copy the **Callback URL (for OAuth)** 
   - It looks like: `https://xxxxx.supabase.co/auth/v1/callback`
5. Use this URL in Google Cloud Console (Step 1.4)

### 2.2 Enable Google Provider in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle it to **Enabled**
4. Enter your credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Click **Save**

### 2.3 Run OAuth Migration

1. Go to **SQL Editor** in Supabase
2. Open `supabase/migrations/002_oauth_support.sql` from your project
3. Copy and paste the entire contents
4. Click **Run**
5. Verify success

## Step 3: Update Your Application

### 3.1 Verify Environment Variables

Your `.env` file should have:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3.2 Update App.jsx to Include Callback Route

Add the OAuth callback route to your router:

```javascript
import AuthCallback from './pages/AuthCallback';

// In your routing logic:
if (path === '/auth/callback') return <AuthCallback onNavigate={navigate} />;
```

### 3.3 Update Main.jsx to Use SupabaseAuthContext

```javascript
import { AuthProvider } from './context/SupabaseAuthContext';

// Wrap your app:
<AuthProvider>
  <App />
</AuthProvider>
```

## Step 4: Test OAuth Flow

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Sign In

1. Navigate to `http://localhost:5173`
2. Click **Continue with Google**
3. You should be redirected to Google's consent screen
4. Grant permissions
5. You should be redirected back to your app
6. Check Supabase Dashboard → **Authentication** → **Users** to see your new user

### 4.3 Verify User Data

1. In Supabase, go to **Table Editor** → `profiles`
2. Find your user
3. Verify these fields are populated:
   - `oauth_provider`: "google"
   - `oauth_provider_id`: Your Google user ID
   - `avatar_url`: Your Google profile picture URL
   - `name`: Your Google account name

## How It Works

### OAuth Flow

1. **User clicks "Continue with Google"**
   - App calls `loginWithGoogle()`
   - Supabase redirects to Google consent screen

2. **User grants permissions**
   - Google redirects to Supabase callback URL
   - Supabase creates/updates auth user

3. **Database trigger fires**
   - `handle_new_user()` function executes
   - Creates profile with OAuth metadata
   - Creates user preferences
   - Creates notification settings

4. **User redirected to app**
   - App receives session from Supabase
   - User is logged in
   - Redirected to dashboard or preferences

### Data Stored

When a user signs in with Google, we store:

```javascript
{
  id: "uuid",
  email: "user@gmail.com",
  name: "John Doe",
  role: "user",
  avatarUrl: "https://lh3.googleusercontent.com/...",
  oauthProvider: "google",
  oauth_provider_id: "google-user-id",
  // ... other profile data
}
```

## Customization

### Change Redirect After Login

In `AuthCallback.jsx`:

```javascript
if (user && !loading) {
  onNavigate('/custom-page'); // Change this
}
```

### Add More OAuth Providers

The system supports multiple providers. To add GitHub, Azure, etc.:

1. Enable provider in Supabase Dashboard
2. Get OAuth credentials from provider
3. Use `loginWithOAuth('github')` in your code

Example:

```javascript
const handleGitHub = async () => {
  const { loginWithOAuth } = useAuth();
  await loginWithOAuth('github');
};
```

### Customize OAuth Scopes

In `supabaseAuthService.js`:

```javascript
async loginWithGoogle(redirectTo) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile', // Add more scopes here
    },
  });
}
```

## Troubleshooting

### "redirect_uri_mismatch" Error

**Problem**: Google shows redirect URI mismatch error

**Solution**:
1. Verify the redirect URI in Google Cloud Console matches exactly
2. Format: `https://your-project-id.supabase.co/auth/v1/callback`
3. No trailing slashes
4. Must use HTTPS (except localhost)

### "Access blocked: This app's request is invalid"

**Problem**: Google blocks the OAuth request

**Solution**:
1. Verify OAuth consent screen is configured
2. Add your email as a test user
3. Ensure Google+ API is enabled
4. Check that scopes are correct

### User Created But No Profile

**Problem**: User appears in `auth.users` but not in `profiles`

**Solution**:
1. Check if `handle_new_user()` trigger exists
2. Run the OAuth migration again
3. Check Supabase logs for trigger errors
4. Manually create profile if needed

### "OAuth is only available with Supabase configuration"

**Problem**: App shows this error when clicking Google button

**Solution**:
1. Verify `.env` file exists
2. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart development server
4. Clear browser cache

### Profile Picture Not Showing

**Problem**: `avatar_url` is null or not displaying

**Solution**:
1. Check if user granted profile scope
2. Verify `avatar_url` is in `profiles` table
3. Check image URL is accessible
4. Ensure CORS is configured for image domain

## Security Best Practices

1. **Never expose Client Secret** - Only store in Supabase, never in frontend code
2. **Use HTTPS in production** - OAuth requires secure connections
3. **Validate redirect URLs** - Only whitelist your domains
4. **Limit scopes** - Only request permissions you need
5. **Review OAuth consent screen** - Keep it clear and honest
6. **Monitor failed attempts** - Check Supabase logs regularly

## Production Checklist

Before going live:

- [ ] OAuth consent screen verified by Google
- [ ] Production domain added to authorized origins
- [ ] Production redirect URI configured
- [ ] Client ID and Secret stored securely
- [ ] HTTPS enabled on production domain
- [ ] Error handling tested
- [ ] User data privacy policy updated
- [ ] Terms of service mention OAuth providers
- [ ] Backup authentication method available (email/password)

## Additional Providers

### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Add redirect URL from Supabase
4. Enable GitHub in Supabase Dashboard
5. Use `loginWithOAuth('github')`

### Microsoft/Azure OAuth

1. Go to Azure Portal → App registrations
2. Create new registration
3. Configure redirect URIs
4. Enable Azure in Supabase Dashboard
5. Use `loginWithOAuth('azure')`

## Support Resources

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Discord](https://discord.supabase.com)

---

**Your Google OAuth integration is now complete!**
