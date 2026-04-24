import { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext(null);

const DEFAULT_PREFS = {
  budget: 1500,
  commute: 30,
  safety: 'medium',
  amenities: { parking: true, laundry: true },
  experience: 'experienced',
  keywords: [],
};

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem('settle_preferences');
      return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    localStorage.setItem('settle_preferences', JSON.stringify(prefs));
  }, [prefs]);

  const updatePrefs = (updates) => setPrefs(p => ({ ...p, ...updates }));

  return (
    <PreferencesContext.Provider value={{ prefs, updatePrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider');
  return ctx;
}
