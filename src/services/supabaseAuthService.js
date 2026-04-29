import { supabase, isSupabaseConfigured } from '../config/supabase';
import { loadAuthConfig } from '../data/authConfig';
import { validateEmail, validatePassword, validateName, validateCity } from '../utils/validators';

class SupabaseAuthService {
  constructor() {
    this.config = null;
    this.initConfig();
  }

  async initConfig() {
    this.config = await loadAuthConfig();
  }

  async getConfig() {
    if (!this.config) {
      this.config = await loadAuthConfig();
    }
    return this.config;
  }

  async login(email, password) {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your environment variables.',
      };
    }

    const config = await this.getConfig();
    const normalizedEmail = email.toLowerCase().trim();

    if (!validateEmail(normalizedEmail)) {
      return {
        success: false,
        error: config.errorMessages.INVALID_EMAIL,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return {
          success: false,
          error: config.errorMessages.INVALID_CREDENTIALS,
        };
      }

      const profile = await this.getUserProfile(data.user.id);

      await this.updateLoginMetadata(data.user.id);

      return {
        success: true,
        user: this.formatUser(data.user, profile),
        session: data.session,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login',
      };
    }
  }

  async signup(userData) {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your environment variables.',
      };
    }

    const config = await this.getConfig();
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

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return {
            success: false,
            error: config.errorMessages.USER_EXISTS,
          };
        }
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        await this.updateUserProfile(data.user.id, {
          target_city: targetCity?.trim() || '',
        });

        const profile = await this.getUserProfile(data.user.id);

        return {
          success: true,
          user: this.formatUser(data.user, profile),
          session: data.session,
        };
      }

      return {
        success: false,
        error: 'Failed to create user account',
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during signup',
      };
    }
  }

  validateSignupData({ name, email, password, targetCity }) {
    const config = this.config || {};
    const errors = [];

    if (!name || !email || !password) {
      errors.push(config.errorMessages?.MISSING_FIELDS || 'Please fill in all required fields');
      return errors;
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation) {
      errors.push(config.errorMessages?.INVALID_EMAIL || 'Invalid email address');
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

  async loginWithGoogle(redirectTo) {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your environment variables.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during Google sign-in',
      };
    }
  }

  async loginWithOAuth(provider, redirectTo) {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured. Please check your environment variables.',
      };
    }

    const validProviders = ['google', 'github', 'azure', 'facebook', 'twitter'];
    if (!validProviders.includes(provider)) {
      return {
        success: false,
        error: `Invalid OAuth provider: ${provider}`,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      return {
        success: false,
        error: `An unexpected error occurred during ${provider} sign-in`,
      };
    }
  }

  async logout() {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  async getCurrentSession() {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async getCurrentUser() {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        const profile = await this.getUserProfile(user.id);
        return this.formatUser(user, profile);
      }

      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async getUserProfile(userId) {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, user_preferences(*), notification_settings(*)')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', userId);

      if (favError) throw favError;

      const { data: savedSearches, error: searchError } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId);

      if (searchError) throw searchError;

      return {
        ...profile,
        favorites: favorites?.map(f => f.listing_id) || [],
        savedSearches: savedSearches || [],
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  async updateUserProfile(userId, updates) {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const profileUpdates = {};
      const preferenceUpdates = {};

      if (updates.name) profileUpdates.name = updates.name;
      if (updates.target_city !== undefined) profileUpdates.target_city = updates.target_city;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.occupation !== undefined) profileUpdates.occupation = updates.occupation;
      if (updates.move_in_date !== undefined) profileUpdates.move_in_date = updates.move_in_date;
      if (updates.pets !== undefined) profileUpdates.pets = updates.pets;
      if (updates.smoking_preference !== undefined) profileUpdates.smoking_preference = updates.smoking_preference;

      if (updates.preferences) {
        if (updates.preferences.budget) {
          preferenceUpdates.budget_min = updates.preferences.budget.min;
          preferenceUpdates.budget_max = updates.preferences.budget.max;
        }
        if (updates.preferences.bedrooms !== undefined) preferenceUpdates.bedrooms = updates.preferences.bedrooms;
        if (updates.preferences.bathrooms !== undefined) preferenceUpdates.bathrooms = updates.preferences.bathrooms;
        if (updates.preferences.amenities) preferenceUpdates.amenities = updates.preferences.amenities;
        if (updates.preferences.neighborhoods) preferenceUpdates.neighborhoods = updates.preferences.neighborhoods;
      }

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userId);

        if (profileError) throw profileError;
      }

      if (Object.keys(preferenceUpdates).length > 0) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .update(preferenceUpdates)
          .eq('user_id', userId);

        if (prefError) throw prefError;
      }

      const updatedProfile = await this.getUserProfile(userId);
      const { data: { user } } = await supabase.auth.getUser();

      return {
        success: true,
        user: this.formatUser(user, updatedProfile),
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateLoginMetadata(userId) {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('login_count')
        .eq('id', userId)
        .single();

      await supabase
        .from('profiles')
        .update({
          last_login: new Date().toISOString(),
          login_count: (profile?.login_count || 0) + 1,
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Update login metadata error:', error);
    }
  }

  formatUser(authUser, profile) {
    if (!profile) {
      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'User',
        role: 'user',
        avatarUrl: authUser.user_metadata?.avatar_url,
        oauthProvider: authUser.app_metadata?.provider,
      };
    }

    return {
      id: authUser.id,
      email: authUser.email,
      name: profile.name,
      role: profile.role,
      targetCity: profile.target_city,
      avatarUrl: profile.avatar_url,
      oauthProvider: profile.oauth_provider,
      preferences: profile.user_preferences?.[0] ? {
        budget: {
          min: profile.user_preferences[0].budget_min,
          max: profile.user_preferences[0].budget_max,
        },
        bedrooms: profile.user_preferences[0].bedrooms,
        bathrooms: profile.user_preferences[0].bathrooms,
        amenities: profile.user_preferences[0].amenities || [],
        neighborhoods: profile.user_preferences[0].neighborhoods || [],
      } : null,
      profile: {
        phone: profile.phone || '',
        occupation: profile.occupation || '',
        moveInDate: profile.move_in_date || '',
        pets: profile.pets || false,
        smokingPreference: profile.smoking_preference || 'non-smoking',
      },
      favorites: profile.favorites || [],
      savedSearches: profile.savedSearches || [],
      notifications: profile.notification_settings?.[0] ? {
        email: profile.notification_settings[0].email_notifications,
        push: profile.notification_settings[0].push_notifications,
        sms: profile.notification_settings[0].sms_notifications,
      } : null,
      metadata: {
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        lastLogin: profile.last_login,
        loginCount: profile.login_count,
        isActive: profile.is_active,
        isVerified: profile.is_verified,
      },
    };
  }

  async hasPermission(user, permission) {
    if (!user || !user.role) return false;

    const config = await this.getConfig();
    const rolePermissions = config.permissions[user.role] || [];
    return rolePermissions.includes(permission);
  }

  hasRole(user, role) {
    return user?.role === role;
  }

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => { } } } };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        const formattedUser = this.formatUser(session.user, profile);
        callback(event, session, formattedUser);
      } else {
        callback(event, session, null);
      }
    });
  }
}

export const supabaseAuthService = new SupabaseAuthService();
