import { supabase, isSupabaseConfigured } from '../config/supabase';

const defaultConfig = {
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },

  sessionConfig: {
    storageKey: 'settle_user',
    tokenStorageKey: 'settle_token',
    expiryDays: 7,
  },

  userRoles: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
  },

  permissions: {
    admin: [
      'view_dashboard',
      'manage_users',
      'view_analytics',
      'manage_listings',
      'manage_settings',
      'view_all_bookings',
      'manage_maintenance',
    ],
    user: [
      'view_dashboard',
      'view_listings',
      'save_favorites',
      'book_tours',
      'submit_maintenance',
      'update_profile',
      'view_notifications',
    ],
    guest: [
      'view_listings',
      'view_public_pages',
    ],
  },

  validationRules: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    name: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'Name must contain only letters, spaces, hyphens, and apostrophes',
    },
    city: {
      minLength: 2,
      maxLength: 100,
      message: 'Please enter a valid city name',
    },
  },

  errorMessages: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'An account with this email already exists',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_NAME: 'Please enter a valid name',
    MISSING_FIELDS: 'Please fill in all required fields',
    TERMS_NOT_AGREED: 'Please agree to the Terms of Service',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
    UNAUTHORIZED: 'You do not have permission to perform this action',
  },
};

let cachedConfig = null;

export async function loadAuthConfig() {
  if (!isSupabaseConfigured()) {
    return defaultConfig;
  }

  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const { data, error } = await supabase
      .from('auth_config')
      .select('config_key, config_value');

    if (error) throw error;

    const supabaseConfig = { ...defaultConfig };

    data.forEach(({ config_key, config_value }) => {
      switch (config_key) {
        case 'password_requirements':
          supabaseConfig.passwordRequirements = { ...defaultConfig.passwordRequirements, ...config_value };
          break;
        case 'session_config':
          supabaseConfig.sessionConfig = { ...defaultConfig.sessionConfig, ...config_value };
          break;
        case 'permissions':
          supabaseConfig.permissions = { ...defaultConfig.permissions, ...config_value };
          break;
        case 'validation_rules':
          if (config_value.email) {
            supabaseConfig.validationRules.email = {
              pattern: new RegExp(config_value.email.pattern),
              message: config_value.email.message,
            };
          }
          if (config_value.name) {
            supabaseConfig.validationRules.name = {
              ...config_value.name,
              pattern: new RegExp(config_value.name.pattern),
            };
          }
          if (config_value.city) {
            supabaseConfig.validationRules.city = config_value.city;
          }
          break;
      }
    });

    cachedConfig = supabaseConfig;
    return supabaseConfig;
  } catch (error) {
    console.error('Error loading auth config from Supabase:', error);
    return defaultConfig;
  }
}

export function clearAuthConfigCache() {
  cachedConfig = null;
}

export async function updateAuthConfig(configKey, configValue) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  try {
    const { error } = await supabase
      .from('auth_config')
      .update({ config_value: configValue, updated_at: new Date().toISOString() })
      .eq('config_key', configKey);

    if (error) throw error;

    clearAuthConfigCache();
    return { success: true };
  } catch (error) {
    console.error('Error updating auth config:', error);
    return { success: false, error: error.message };
  }
}

export const authConfig = defaultConfig;
