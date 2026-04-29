import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { authConfig } from '../data/authConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem(authConfig.sessionConfig.storageKey);
      const storedSession = authService.getStoredSession();

      if (storedUser && storedSession) {
        const validation = authService.validateSession(storedSession.token);

        if (validation.valid) {
          setUser(JSON.parse(storedUser));
          setSession(storedSession);
        } else {
          authService.clearSession();
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      authService.clearSession();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        setUser(result.user);
        setSession(result.session);
        localStorage.setItem(authConfig.sessionConfig.storageKey, JSON.stringify(result.user));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during login';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (userData) => {
    setError(null);

    try {
      const result = await authService.signup(userData);

      if (result.success) {
        setUser(result.user);
        setSession(result.session);
        localStorage.setItem(authConfig.sessionConfig.storageKey, JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error, errors: result.errors };
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during signup';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    try {
      if (user) {
        authService.logout(user.id);
      }
      setUser(null);
      setSession(null);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const result = authService.updateUserProfile(user.id, updates);

      if (result.success) {
        setUser(result.user);
        localStorage.setItem(authConfig.sessionConfig.storageKey, JSON.stringify(result.user));
        return { success: true, user: result.user };
      }

      return result;
    } catch (err) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(user, permission);
  };

  const hasRole = (role) => {
    return authService.hasRole(user, role);
  };

  const isAuthenticated = () => {
    return !!user && !!session;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    logout,
    signup,
    updateProfile,
    hasPermission,
    hasRole,
    isAuthenticated,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
