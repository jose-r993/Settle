# Supabase Integration - Quick Reference

## 🚀 Quick Start

1. **Install dependencies** (already done):
```bash
npm install @supabase/supabase-js
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Run database migrations**:
- Copy `supabase/migrations/001_initial_schema.sql`
- Paste into Supabase SQL Editor
- Run the migration

4. **Start development**:
```bash
npm run dev
```

## 📁 File Structure

```
src/
├── config/
│   └── supabase.js                    # Supabase client configuration
├── data/
│   └── authConfig.js                  # Config loader (from Supabase or defaults)
├── services/
│   ├── authService.js                 # Mock auth (localStorage fallback)
│   └── supabaseAuthService.js         # Supabase auth implementation
└── context/
    ├── AuthContext.jsx                # Original context (localStorage)
    └── SupabaseAuthContext.jsx        # Supabase-enabled context

supabase/
└── migrations/
    └── 001_initial_schema.sql         # Database schema
```

## 🔄 How It Works

### Automatic Fallback
The system automatically detects if Supabase is configured:
- **With Supabase**: Uses `supabaseAuthService` + Supabase Auth
- **Without Supabase**: Falls back to `authService` + localStorage

### Configuration Loading
```javascript
// authConfig.js loads from Supabase if available
import { loadAuthConfig } from './src/data/authConfig';

const config = await loadAuthConfig();
// Returns Supabase config or defaults
```

### Using the Auth Context

**Option 1: Use existing AuthContext (localStorage)**
```javascript
import { AuthProvider } from './src/context/AuthContext';
```

**Option 2: Use SupabaseAuthContext (auto-detects)**
```javascript
import { AuthProvider } from './src/context/SupabaseAuthContext';
```

## 🔑 Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users) |
| `user_preferences` | Search preferences |
| `notification_settings` | Notification preferences |
| `favorites` | Saved listings |
| `saved_searches` | Saved search criteria |
| `auth_config` | Dynamic auth configuration |

## 🎯 Key Features

✅ **Dynamic Configuration**: Auth rules stored in database  
✅ **Automatic Fallback**: Works without Supabase  
✅ **Row Level Security**: Built-in data protection  
✅ **Auto-triggers**: Profile creation on signup  
✅ **Session Management**: 7-day auto-refresh  
✅ **Permission System**: Role-based access control  

## 🔐 Permissions

Defined in `auth_config` table, fetched dynamically:

```javascript
const { hasPermission } = useAuth();

if (await hasPermission('manage_users')) {
  // Admin feature
}
```

## 📝 Example Usage

### Signup
```javascript
const { signup } = useAuth();

const result = await signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  targetCity: 'Dallas',
});
```

### Update Profile
```javascript
const { updateProfile } = useAuth();

await updateProfile({
  target_city: 'Austin',
  preferences: {
    budget: { min: 1500, max: 3000 },
  },
});
```

## 🛠️ Development

### With Supabase
1. Configure `.env`
2. Run migrations
3. Develop normally

### Without Supabase (Mock Mode)
1. Don't create `.env`
2. App uses localStorage automatically
3. Perfect for offline development

## 📚 Documentation

- **Full Setup Guide**: `docs/SUPABASE_SETUP.md`
- **Auth System Docs**: `docs/AUTH_SYSTEM.md`
- **Quick Start**: `AUTHENTICATION_GUIDE.md`

## 🔄 Migration Path

### From localStorage to Supabase
1. Set up Supabase project
2. Run migrations
3. Add `.env` file
4. Restart app
5. Data automatically syncs to Supabase on next signup/login

### From Supabase back to localStorage
1. Remove `.env` file
2. Restart app
3. App falls back to localStorage mode

## ⚡ Performance

- **Config Caching**: Auth config cached after first load
- **Session Storage**: localStorage for fast access
- **Auto-refresh**: Sessions refresh automatically
- **Optimistic Updates**: UI updates before server confirmation

## 🐛 Debugging

Check if Supabase is configured:
```javascript
import { isSupabaseConfigured } from './src/config/supabase';

console.log('Using Supabase:', isSupabaseConfigured());
```

View current auth mode:
```javascript
const { useSupabase } = useAuth();
console.log('Auth mode:', useSupabase ? 'Supabase' : 'localStorage');
```

## 🎓 Learning Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Ready to use! See `docs/SUPABASE_SETUP.md` for detailed setup instructions.**
