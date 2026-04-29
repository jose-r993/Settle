import { authConfig } from '../data/authConfig';

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return authConfig.validationRules.email.pattern.test(email.trim());
}

export function validatePassword(password) {
  const { passwordRequirements } = authConfig;
  const errors = [];

  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      error: 'Password is required',
      errors: ['Password is required'],
    };
  }

  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`);
  }

  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null,
    errors,
  };
}

export function validateName(name) {
  const { validationRules } = authConfig;
  
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      error: 'Name is required',
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < validationRules.name.minLength) {
    return {
      valid: false,
      error: `Name must be at least ${validationRules.name.minLength} characters long`,
    };
  }

  if (trimmedName.length > validationRules.name.maxLength) {
    return {
      valid: false,
      error: `Name must not exceed ${validationRules.name.maxLength} characters`,
    };
  }

  if (!validationRules.name.pattern.test(trimmedName)) {
    return {
      valid: false,
      error: validationRules.name.message,
    };
  }

  return { valid: true };
}

export function validateCity(city) {
  const { validationRules } = authConfig;
  
  if (!city || typeof city !== 'string') {
    return {
      valid: false,
      error: 'City is required',
    };
  }

  const trimmedCity = city.trim();

  if (trimmedCity.length < validationRules.city.minLength) {
    return {
      valid: false,
      error: `City name must be at least ${validationRules.city.minLength} characters long`,
    };
  }

  if (trimmedCity.length > validationRules.city.maxLength) {
    return {
      valid: false,
      error: `City name must not exceed ${validationRules.city.maxLength} characters`,
    };
  }

  return { valid: true };
}

export function getPasswordStrength(password) {
  if (!password) return { strength: 'none', score: 0 };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longLength: password.length >= 12,
  };

  score += checks.length ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.numbers ? 1 : 0;
  score += checks.special ? 1 : 0;
  score += checks.longLength ? 1 : 0;

  let strength = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { strength, score, checks };
}
