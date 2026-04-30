# Supabase Authentication Setup Guide

## Overview

The Settle application now uses **Supabase** as the backend for authentication and data management. The system is designed to work with or without Supabase - it will automatically fall back to localStorage-based mock authentication if Supabase is not configured.

## Prerequisites

1. A Supabase account (free tier works fine)
2. Node.js and npm installed
3. The Settle application repository

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Settle (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Navigate to **API** section
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your Settle project root, create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env` to version control. It's already in `.gitignore`.

## Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. In your Supabase project, click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. Verify success - you should see "Success. No rows returned"

### Option B: Using Supabase CLI (Advanced)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-id
```

4. Run migrations:
```bash
supabase db push
```

## Step 5: Verify Database Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see the following tables:
   - `profiles`
   - `user_preferences`
   - `notification_settings`
   - `favorites`
   - `saved_searches`
   - `auth_config`

3. Click on `auth_config` table
4. Verify it has 4 rows with configuration data

## Step 6: Test Authentication

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:5173`
3. Try signing up with a new account
4. Check Supabase Dashboard → **Authentication** → **Users** to see your new user

## Database Schema

### Tables Created

#### `profiles`
Extends Supabase's built-in `auth.users` table with additional user information.

**Columns:**
- `id` (UUID, PK) - References auth.users(id)
- `name` (TEXT) - User's full name
- `role` (ENUM) - User role: 'admin', 'user', or 'guest'
- `target_city` (TEXT) - City user is moving to
- `phone`, `occupation`, `move_in_date`, `pets`, `smoking_preference`
- Metadata: `created_at`, `updated_at`, `last_login`, `login_count`, `is_active`, `is_verified`

#### `user_preferences`
Stores user's apartment search preferences.

**Columns:**
- `user_id` (UUID, FK) - References profiles(id)
- `budget_min`, `budget_max` (INTEGER)
- `bedrooms`, `bathrooms` (INTEGER)
- `amenities`, `neighborhoods` (TEXT[])

#### `notification_settings`
User notification preferences.

**Columns:**
- `user_id` (UUID, FK)
- `email_notifications`, `push_notifications`, `sms_notifications` (BOOLEAN)

#### `favorites`
User's saved/favorited listings.

**Columns:**
- `user_id` (UUID, FK)
- `listing_id` (TEXT)

#### `saved_searches`
User's saved search criteria.

**Columns:**
- `user_id` (UUID, FK)
- `name` (TEXT)
- `search_criteria` (JSONB)

#### `auth_config`
Stores authentication configuration (password requirements, permissions, etc.)

**Columns:**
- `config_key` (TEXT, UNIQUE)
- `config_value` (JSONB)

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Users can only view/edit their own data
- Admins can view all profiles
- Auth config is read-only for all authenticated users, writable only by admins

## Authentication Flow

### Signup
1. User submits signup form
2. Supabase creates auth user
3. Database trigger (`handle_new_user`) automatically creates:
   - Profile entry
   - User preferences entry
   - Notification settings entry
4. User is logged in automatically

### Login
1. User submits credentials
2. Supabase validates and creates session
3. App fetches user profile and related data
4. Login metadata updated (last_login, login_count)

### Session Management
- Sessions stored in localStorage with key `settle_auth`
- Auto-refresh enabled (7-day expiry by default)
- Session state synced across tabs

## Configuration Management

Authentication configuration is stored in the `auth_config` table and can be updated dynamically:

```javascript
import { updateAuthConfig } from './src/data/authConfig';

// Update password requirements
await updateAuthConfig('password_requirements', {
  minLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
});

// Update permissions
await updateAuthConfig('permissions', {
  admin: [...adminPermissions],
  user: [...userPermissions],
});
```

## Fallback Mode (No Supabase)

If Supabase is not configured (no `.env` file or invalid credentials):
- App automatically uses localStorage-based mock authentication
- All features work with local data
- Perfect for development without backend
- Console warning: "Supabase credentials not found. Using mock authentication."

## Testing

### Create Test Users

**Via Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Fill in email and password
4. User will be created in `auth.users` and `profiles` automatically

**Via Signup Form:**
1. Use the app's signup page
2. All data is created automatically via triggers

### Assign Admin Role

1. Go to **Table Editor** → `profiles`
2. Find the user
3. Edit the `role` column to `admin`
4. Save

## Security Best Practices

1. **Never commit `.env`** - It's in `.gitignore` by default
2. **Use environment variables** - Never hardcode credentials
3. **Enable RLS** - Already configured in migrations
4. **Rotate keys regularly** - Use Supabase dashboard to generate new keys
5. **Use HTTPS in production** - Supabase enforces this automatically

## Troubleshooting

### "Supabase is not configured" error
- Check `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding `.env`

### Users not appearing in database
- Check SQL Editor for errors when running migration
- Verify `handle_new_user` trigger exists
- Check Supabase logs: **Logs** → **Postgres Logs**

### RLS policy errors
- Ensure you're logged in when testing
- Check policies in **Authentication** → **Policies**
- Verify user role in `profiles` table

### Session not persisting
- Check browser localStorage for `settle_auth` key
- Verify session expiry settings in `auth_config` table
- Clear browser cache and try again

## Advanced Configuration

### Custom Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### OAuth Providers

1. Go to **Authentication** → **Providers**
2. Enable providers (Google, GitHub, etc.)
3. Configure OAuth credentials
4. Update login UI to include OAuth buttons

### Database Backups

1. Go to **Database** → **Backups**
2. Enable automatic daily backups
3. Download manual backups as needed

## Migration to Production

1. Create a production Supabase project
2. Run migrations on production database
3. Update production `.env` with production credentials
4. Configure custom domain (optional)
5. Set up monitoring and alerts

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Project Issues**: Create an issue in your repository

## Next Steps

After setup:
1. ✅ Test signup and login
2. ✅ Verify user data in Supabase dashboard
3. ✅ Test permission-based features
4. ✅ Configure email templates
5. ✅ Set up OAuth providers (optional)
6. ✅ Deploy to production

---

**Your Supabase authentication system is now fully configured!**
