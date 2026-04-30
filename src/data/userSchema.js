export const createUser = (data) => {
  return {
    id: data.id || generateUserId(),
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role || 'user',
    targetCity: data.targetCity || '',
    preferences: data.preferences || {
      budget: { min: 0, max: 5000 },
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      neighborhoods: [],
    },
    profile: data.profile || {
      phone: '',
      occupation: '',
      moveInDate: '',
      pets: false,
      smokingPreference: 'non-smoking',
    },
    favorites: data.favorites || [],
    savedSearches: data.savedSearches || [],
    notifications: data.notifications || {
      email: true,
      push: true,
      sms: false,
    },
    metadata: {
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isVerified: data.isVerified || false,
    },
  };
};

export const createSession = (user) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  
  return {
    userId: user.id,
    token: generateSessionToken(),
    createdAt: new Date().toISOString(),
    expiresAt: expiryDate.toISOString(),
    isValid: true,
  };
};

export const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

function generateUserId() {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionToken() {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

export const userSchema = {
  required: ['name', 'email', 'password'],
  optional: ['targetCity', 'role', 'preferences', 'profile'],
};
