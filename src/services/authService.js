import { authConfig } from '../data/authConfig';
import { createUser, createSession, sanitizeUser } from '../data/userSchema';
import { validateEmail, validatePassword, validateName, validateCity } from '../utils/validators';
import users from '../data/users.json';

class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.sessions = new Map();
  }

  loadUsers() {
    try {
      const storedUsers = localStorage.getItem('settle_users_db');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
      this.saveUsers(users);
      return [...users];
    } catch (error) {
      console.error('Error loading users:', error);
      return [...users];
    }
  }

  saveUsers(userList) {
    try {
      localStorage.setItem('settle_users_db', JSON.stringify(userList));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!validateEmail(normalizedEmail)) {
      return {
        success: false,
        error: authConfig.errorMessages.INVALID_EMAIL,
      };
    }

    const user = this.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: authConfig.errorMessages.INVALID_CREDENTIALS,
      };
    }

    if (!user.metadata?.isActive) {
      return {
        success: false,
        error: 'This account has been deactivated',
      };
    }

    user.metadata = {
      ...user.metadata,
      lastLogin: new Date().toISOString(),
      loginCount: (user.metadata?.loginCount || 0) + 1,
    };

    const userIndex = this.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
      this.saveUsers(this.users);
    }

    const session = createSession(user);
    this.sessions.set(user.id, session);
    
    this.saveSession(session);

    return {
      success: true,
      user: sanitizeUser(user),
      session,
    };
  }

  async signup(userData) {
    const { name, email, password, targetCity } = userData;

    const validationErrors = this.validateSignupData({ name, email, password, targetCity });
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors[0],
        errors: validationErrors,
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    if (this.users.find((u) => u.email.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        error: authConfig.errorMessages.USER_EXISTS,
      };
    }

    const newUser = createUser({
      name: name.trim(),
      email: normalizedEmail,
      password,
      targetCity: targetCity?.trim() || '',
      role: 'user',
    });

    this.users.push(newUser);
    this.saveUsers(this.users);

    const session = createSession(newUser);
    this.sessions.set(newUser.id, session);
    
    this.saveSession(session);

    return {
      success: true,
      user: sanitizeUser(newUser),
      session,
    };
  }

  validateSignupData({ name, email, password, targetCity }) {
    const errors = [];

    if (!name || !email || !password) {
      errors.push(authConfig.errorMessages.MISSING_FIELDS);
      return errors;
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation) {
      errors.push(authConfig.errorMessages.INVALID_EMAIL);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.error);
    }

    if (targetCity) {
      const cityValidation = validateCity(targetCity);
      if (!cityValidation.valid) {
        errors.push(cityValidation.error);
      }
    }

    return errors;
  }

  logout(userId) {
    this.sessions.delete(userId);
    this.clearSession();
    return { success: true };
  }

  validateSession(sessionToken) {
    const storedSession = this.getStoredSession();
    
    if (!storedSession || storedSession.token !== sessionToken) {
      return { valid: false, error: authConfig.errorMessages.SESSION_EXPIRED };
    }

    const expiryDate = new Date(storedSession.expiresAt);
    if (expiryDate < new Date()) {
      this.clearSession();
      return { valid: false, error: authConfig.errorMessages.SESSION_EXPIRED };
    }

    return { valid: true, session: storedSession };
  }

  hasPermission(user, permission) {
    if (!user || !user.role) return false;
    
    const rolePermissions = authConfig.permissions[user.role] || [];
    return rolePermissions.includes(permission);
  }

  hasRole(user, role) {
    return user?.role === role;
  }

  updateUserProfile(userId, updates) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const user = this.users[userIndex];
    
    const updatedUser = {
      ...user,
      ...updates,
      metadata: {
        ...user.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    this.users[userIndex] = updatedUser;
    this.saveUsers(this.users);

    return {
      success: true,
      user: sanitizeUser(updatedUser),
    };
  }

  saveSession(session) {
    try {
      localStorage.setItem(authConfig.sessionConfig.tokenStorageKey, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  getStoredSession() {
    try {
      const stored = localStorage.getItem(authConfig.sessionConfig.tokenStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  clearSession() {
    try {
      localStorage.removeItem(authConfig.sessionConfig.tokenStorageKey);
      localStorage.removeItem(authConfig.sessionConfig.storageKey);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  getAllUsers() {
    return this.users.map(sanitizeUser);
  }

  getUserById(userId) {
    const user = this.users.find(u => u.id === userId);
    return user ? sanitizeUser(user) : null;
  }
}

export const authService = new AuthService();
