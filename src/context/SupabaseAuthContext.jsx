import { createContext, useContext, useState, useEffect } from 'react';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { isSupabaseConfigured } from '../config/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSupabase] = useState(isSupabaseConfigured());

  const activeAuthService = useSupabase ? supabaseAuthService : authService;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (useSupabase) {
        const currentSession = await supabaseAuthService.getCurrentSession();

        if (currentSession) {
          const currentUser = await supabaseAuthService.getCurrentUser();
          setUser(currentUser);
          setSession(currentSession);
        }

        const { data: { subscription } } = supabaseAuthService.onAuthStateChange(
          async (event, session, formattedUser) => {
            console.log('Auth state changed:', event, !!formattedUser);

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setSession(session);
              setUser(formattedUser);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
            } else if (event === 'USER_UPDATED') {
              setUser(formattedUser);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } else {
        const storedUser = localStorage.getItem('settle_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);

    try {
      const result = await activeAuthService.login(email, password);

      if (result.success) {
        setUser(result.user);
        setSession(result.session);

        if (!useSupabase) {
          localStorage.setItem('settle_user', JSON.stringify(result.user));
        }

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
      const result = await activeAuthService.signup(userData);

      if (result.success) {
        setUser(result.user);
        setSession(result.session);

        if (!useSupabase) {
          localStorage.setItem('settle_user', JSON.stringify(result.user));
        }

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

  const logout = async () => {
    try {
      await activeAuthService.logout();
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
      const result = await activeAuthService.updateUserProfile(user.id, updates);

      if (result.success) {
        setUser(result.user);

        if (!useSupabase) {
          localStorage.setItem('settle_user', JSON.stringify(result.user));
        }

        return { success: true, user: result.user };
      }

      return result;
    } catch (err) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const hasPermission = async (permission) => {
    return await activeAuthService.hasPermission(user, permission);
  };

  const hasRole = (role) => {
    return activeAuthService.hasRole(user, role);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const loginWithGoogle = async (redirectTo) => {
    setError(null);

    if (!useSupabase) {
      const errorMsg = 'OAuth is only available with Supabase configuration';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const result = await supabaseAuthService.loginWithGoogle(redirectTo);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during Google sign-in';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const loginWithOAuth = async (provider, redirectTo) => {
    setError(null);

    if (!useSupabase) {
      const errorMsg = 'OAuth is only available with Supabase configuration';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const result = await supabaseAuthService.loginWithOAuth(provider, redirectTo);

      if (!result.success) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMsg = `An unexpected error occurred during ${provider} sign-in`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
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
    loginWithGoogle,
    loginWithOAuth,
    hasPermission,
    hasRole,
    isAuthenticated,
    clearError,
    useSupabase,
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
