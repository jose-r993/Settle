# Authentication System Documentation

## Overview

The Settle application uses a **data-driven authentication system** that provides secure user authentication, role-based access control (RBAC), and comprehensive session management. The system is built with a modular architecture that separates concerns between data models, business logic, and UI components.

## Architecture

### Core Components

```
src/
├── data/
│   ├── authConfig.js       # Configuration for auth rules and permissions
│   ├── userSchema.js       # User data models and schemas
│   └── users.json          # User database (mock data)
├── services/
│   └── authService.js      # Authentication business logic
├── context/
│   └── AuthContext.jsx     # React context for auth state
├── utils/
│   └── validators.js       # Input validation utilities
├── hooks/
│   └── usePermissions.js   # Permission checking hooks
└── components/
    └── auth/
        └── ProtectedRoute.jsx  # Route protection component
```

## Features

### 1. **Data-Driven Configuration**

All authentication rules, permissions, and validation requirements are defined in `authConfig.js`:

```javascript
// Password requirements
passwordRequirements: {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
}

// User roles and permissions
userRoles: {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}

permissions: {
  admin: ['view_dashboard', 'manage_users', 'view_analytics', ...],
  user: ['view_dashboard', 'view_listings', 'save_favorites', ...],
  guest: ['view_listings', 'view_public_pages'],
}
```

### 2. **User Schema**

Users follow a structured schema defined in `userSchema.js`:

```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'user' | 'guest',
  targetCity: string,
  preferences: {
    budget: { min: number, max: number },
    bedrooms: number,
    bathrooms: number,
    amenities: string[],
    neighborhoods: string[],
  },
  profile: {
    phone: string,
    occupation: string,
    moveInDate: string,
    pets: boolean,
    smokingPreference: string,
  },
  favorites: string[],
  savedSearches: object[],
  notifications: {
    email: boolean,
    push: boolean,
    sms: boolean,
  },
  metadata: {
    createdAt: string,
    updatedAt: string,
    lastLogin: string | null,
    loginCount: number,
    isActive: boolean,
    isVerified: boolean,
  }
}
```

### 3. **Authentication Service**

The `authService` provides centralized authentication logic:

#### Login
```javascript
const result = await authService.login(email, password);
// Returns: { success: boolean, user?: object, session?: object, error?: string }
```

#### Signup
```javascript
const result = await authService.signup({
  name, email, password, targetCity
});
// Returns: { success: boolean, user?: object, session?: object, error?: string }
```

#### Session Management
- Automatic session validation
- 7-day session expiry
- Token-based session storage

### 4. **Validation System**

Comprehensive validation utilities in `validators.js`:

- **Email Validation**: RFC-compliant email pattern matching
- **Password Validation**: Configurable strength requirements
- **Name Validation**: Character restrictions and length limits
- **Password Strength Meter**: Real-time strength calculation

```javascript
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validators';

const emailValid = validateEmail('user@example.com');
const passwordValid = validatePassword('MyPass123');
const strength = getPasswordStrength('MyPass123');
// Returns: { strength: 'medium', score: 4, checks: {...} }
```

### 5. **Role-Based Access Control (RBAC)**

#### Using the AuthContext
```javascript
const { user, hasPermission, hasRole } = useAuth();

if (hasPermission('manage_users')) {
  // Show admin controls
}

if (hasRole('admin')) {
  // Admin-only features
}
```

#### Using Permission Hooks
```javascript
import { usePermissions } from '../hooks/usePermissions';

const { can, isAdmin, canAny } = usePermissions();

if (can('view_analytics')) {
  // Show analytics
}

if (canAny(['manage_users', 'view_analytics'])) {
  // Show if user has any of these permissions
}
```

#### Protected Routes
```javascript
import ProtectedRoute from '../components/auth/ProtectedRoute';

<ProtectedRoute requirePermission="manage_users">
  <AdminPanel />
</ProtectedRoute>

<ProtectedRoute requireRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

## Usage Examples

### 1. Login Flow

```javascript
import { useAuth } from '../context/AuthContext';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (result.success) {
      // Navigate to dashboard
    } else {
      // Show error: result.error
    }
  };
}
```

### 2. Signup Flow

```javascript
const { signup } = useAuth();

const handleSignup = async (userData) => {
  const result = await signup({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    targetCity: 'Dallas',
  });
  
  if (result.success) {
    // Navigate to preferences
  } else {
    // Show errors: result.errors
  }
};
```

### 3. Update User Profile

```javascript
const { updateProfile } = useAuth();

const handleUpdate = async () => {
  const result = await updateProfile({
    targetCity: 'Austin',
    preferences: {
      budget: { min: 1500, max: 3000 },
    },
  });
  
  if (result.success) {
    // Profile updated
  }
};
```

### 4. Check Permissions

```javascript
import { usePermissions } from '../hooks/usePermissions';

function FeatureComponent() {
  const { can, isAdmin } = usePermissions();
  
  return (
    <div>
      {can('save_favorites') && <FavoriteButton />}
      {isAdmin() && <AdminControls />}
    </div>
  );
}
```

## Security Features

1. **Password Requirements**: Configurable password strength rules
2. **Session Expiry**: Automatic 7-day session timeout
3. **Session Validation**: Token-based validation on each request
4. **Password Sanitization**: Passwords never stored in session/context
5. **Email Normalization**: Case-insensitive email handling
6. **Input Validation**: Comprehensive validation before processing
7. **Error Messages**: User-friendly, non-revealing error messages

## Configuration

### Modifying Password Requirements

Edit `src/data/authConfig.js`:

```javascript
passwordRequirements: {
  minLength: 10,              // Change minimum length
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,  // Enable special characters
}
```

### Adding New Permissions

1. Add permission to role in `authConfig.js`:
```javascript
permissions: {
  admin: [...existingPermissions, 'new_permission'],
}
```

2. Use in components:
```javascript
if (hasPermission('new_permission')) {
  // Feature code
}
```

### Adding New User Roles

1. Define role in `authConfig.js`:
```javascript
userRoles: {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',  // New role
}
```

2. Define permissions:
```javascript
permissions: {
  moderator: ['view_dashboard', 'moderate_content'],
}
```

## Data Persistence

Currently uses **localStorage** for mock data persistence:

- **User Database**: `settle_users_db`
- **Session Token**: `settle_token`
- **Current User**: `settle_user`

### Future Backend Integration

The system is designed for easy backend integration:

1. Replace `authService` methods with API calls
2. Update session management to use JWT tokens
3. Replace localStorage with secure HTTP-only cookies
4. Add refresh token logic

## Testing

### Demo Accounts

**Regular User:**
- Email: `demo@settle.com`
- Password: `password`
- Role: `user`

**Admin User:**
- Email: `jose@settle.com`
- Password: `password`
- Role: `admin`

### Creating New Users

New users can be created through:
1. Signup form (automatically creates with 'user' role)
2. Manual addition to `users.json` (for testing different roles)

## Error Handling

All authentication operations return structured responses:

```javascript
{
  success: boolean,
  user?: object,      // On success
  session?: object,   // On success
  error?: string,     // Single error message
  errors?: string[],  // Multiple validation errors
}
```

## Best Practices

1. **Always use the AuthContext**: Don't access localStorage directly
2. **Check permissions, not roles**: Use `hasPermission()` instead of checking roles
3. **Validate on both client and server**: Client validation is for UX only
4. **Clear errors appropriately**: Use `clearError()` when switching forms
5. **Handle loading states**: Use `loading` from AuthContext during initialization
6. **Sanitize user data**: Never expose passwords in UI or logs

## Troubleshooting

### Session Not Persisting
- Check localStorage is enabled
- Verify session hasn't expired (7 days)
- Check browser console for errors

### Permission Denied
- Verify user role in `users.json`
- Check permission is defined in `authConfig.js`
- Ensure user is logged in

### Validation Errors
- Check `authConfig.js` for validation rules
- Review error messages in `authConfig.errorMessages`
- Use browser console to debug validation logic

## Future Enhancements

- [ ] Email verification system
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Rate limiting for login attempts
- [ ] Account lockout after failed attempts
- [ ] Audit logging for security events
- [ ] Backend API integration
- [ ] JWT token refresh mechanism
