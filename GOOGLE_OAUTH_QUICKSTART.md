# Google OAuth - Quick Start

## 🚀 5-Minute Setup

### 1. Google Cloud Console (2 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create/select project
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. Configure:
   - Type: **Web application**
   - Authorized redirect URIs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**

### 2. Supabase Dashboard (2 minutes)

1. Go to your Supabase project
2. **Authentication** → **Providers** → **Google**
3. Toggle **Enabled**
4. Paste **Client ID** and **Client Secret**
5. Click **Save**

### 3. Run Migration (1 minute)

1. Supabase → **SQL Editor** → **New query**
2. Copy contents of `supabase/migrations/002_oauth_support.sql`
3. Paste and **Run**

### 4. Update Your App

**Add callback route to `App.jsx`:**

```javascript
import AuthCallback from './pages/AuthCallback';

// In your routing:
if (path === '/auth/callback') return <AuthCallback onNavigate={navigate} />;
```

**Update `main.jsx` to use SupabaseAuthContext:**

```javascript
import { AuthProvider } from './context/SupabaseAuthContext';

// Wrap app:
<AuthProvider>
  <App />
</AuthProvider>
```

### 5. Test

```bash
npm run dev
```

Click "Continue with Google" → Should redirect to Google → Sign in → Redirected back to app ✓

## 🎯 What You Get

✅ **One-click Google sign-in**  
✅ **Auto-created user profiles**  
✅ **Profile pictures from Google**  
✅ **No password management needed**  
✅ **Works alongside email/password**  

## 📝 Important URLs

**Get Supabase Callback URL:**
- Supabase Dashboard → Authentication → Providers → Google
- Copy the "Callback URL (for OAuth)"

**Add to Google Cloud Console:**
- Must match exactly: `https://xxxxx.supabase.co/auth/v1/callback`

## 🐛 Common Issues

**"redirect_uri_mismatch"**
- Check redirect URI in Google Console matches Supabase exactly
- No trailing slashes

**"OAuth is only available with Supabase"**
- Verify `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server

**User created but no profile**
- Run migration `002_oauth_support.sql`
- Check Supabase logs for trigger errors

## 📚 Full Documentation

See `docs/GOOGLE_OAUTH_SETUP.md` for complete setup guide with troubleshooting.

---

**That's it! Google OAuth is now enabled.**
