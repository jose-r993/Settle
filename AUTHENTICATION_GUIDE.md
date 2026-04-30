# Authentication System - Quick Start Guide

## Overview

Your Settle application now has a **complete data-driven authentication system** with role-based access control, comprehensive validation, and session management.

## What Was Built

### 1. **Data Layer** (`src/data/`)
- **`authConfig.js`**: Centralized configuration for all auth rules, permissions, and validation
- **`userSchema.js`**: User data models and schema definitions
- **`users.json`**: Enhanced with roles, preferences, profile data, and metadata

### 2. **Service Layer** (`src/services/`)
- **`authService.js`**: Complete authentication business logic
  - Login with validation
  - Signup with comprehensive checks
  - Session management (7-day expiry)
  - Permission checking
  - User profile updates

### 3. **Validation** (`src/utils/`)
- **`validators.js`**: Input validation utilities
  - Email validation (RFC-compliant)
  - Password strength validation
  - Name and city validation
  - Real-time password strength meter

### 4. **Context & Hooks** (`src/context/`, `src/hooks/`)
- **`AuthContext.jsx`**: Enhanced with async operations, error handling, and permissions
- **`usePermissions.js`**: Permission checking hooks

### 5. **Components** (`src/components/auth/`)
- **`ProtectedRoute.jsx`**: Route protection with permission/role requirements
- **`PermissionGate.jsx`**: Conditional rendering based on permissions

### 6. **UI Updates** (`src/pages/`)
- **`Login.jsx`**: Enhanced with:
  - Real-time password strength indicator
  - Async form submission
  - Loading states
  - Better error handling

## Quick Usage Examples

### 1. Using Authentication in Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

### 2. Checking Permissions

```javascript
import { usePermissions } from '../hooks/usePermissions';

function AdminPanel() {
  const { can, isAdmin } = usePermissions();
  
  return (
    <div>
      {can('manage_users') && <UserManagement />}
      {isAdmin() && <SystemSettings />}
    </div>
  );
}
```

### 3. Protecting Routes

```javascript
import ProtectedRoute from '../components/auth/ProtectedRoute';

<ProtectedRoute requirePermission="manage_users">
  <AdminDashboard />
</ProtectedRoute>
```

### 4. Conditional Rendering

```javascript
import PermissionGate from '../components/auth/PermissionGate';

<PermissionGate permission="save_favorites">
  <FavoriteButton />
</PermissionGate>

<PermissionGate role="admin">
  <AdminControls />
</PermissionGate>
```

## Available Permissions

### Admin Permissions
- `view_dashboard`
- `manage_users`
- `view_analytics`
- `manage_listings`
- `manage_settings`
- `view_all_bookings`
- `manage_maintenance`

### User Permissions
- `view_dashboard`
- `view_listings`
- `save_favorites`
- `book_tours`
- `submit_maintenance`
- `update_profile`
- `view_notifications`

### Guest Permissions
- `view_listings`
- `view_public_pages`

## Test Accounts

**Regular User:**
- Email: `demo@settle.com`
- Password: `password`
- Role: `user`

**Admin User:**
- Email: `jose@settle.com`
- Password: `password`
- Role: `admin`

## Password Requirements

Current configuration (can be modified in `authConfig.js`):
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters: Optional

## Key Features

✅ **Data-Driven**: All rules defined in configuration files  
✅ **Role-Based Access Control**: Admin, User, Guest roles  
✅ **Permission System**: Granular permission checking  
✅ **Session Management**: 7-day auto-expiring sessions  
✅ **Input Validation**: Comprehensive validation with helpful errors  
✅ **Password Strength**: Real-time strength indicator  
✅ **Profile Management**: Update user preferences and profile  
✅ **Protected Routes**: Easy route protection components  
✅ **Loading States**: Proper async handling throughout  

## Customization

### Adding New Permissions

1. Edit `src/data/authConfig.js`:
```javascript
permissions: {
  admin: [...existing, 'new_permission'],
}
```

2. Use in your components:
```javascript
if (hasPermission('new_permission')) {
  // Your code
}
```

### Changing Password Requirements

Edit `src/data/authConfig.js`:
```javascript
passwordRequirements: {
  minLength: 10,
  requireSpecialChars: true,
}
```

### Adding User Fields

1. Update schema in `src/data/userSchema.js`
2. Update `users.json` with new fields
3. Update signup form to collect new data

## Documentation

Full documentation available in:
- **`docs/AUTH_SYSTEM.md`**: Complete technical documentation
- **`src/data/authConfig.js`**: Configuration reference
- **`src/services/authService.js`**: Service API documentation

## Next Steps

1. **Test the system**: Try logging in with demo accounts
2. **Create new users**: Use the signup form
3. **Add protected pages**: Use `ProtectedRoute` component
4. **Implement permissions**: Use `PermissionGate` for features
5. **Customize**: Modify `authConfig.js` to fit your needs

## Backend Integration (Future)

The system is designed for easy backend integration:
1. Replace `authService` localStorage calls with API calls
2. Implement JWT token handling
3. Add refresh token logic
4. Use HTTP-only cookies for sessions

---

**Your authentication system is now fully functional and ready to use!**
