import { createContext, useContext, useState, useEffect } from 'react';
import users from '../data/users.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('settle_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    const match = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!match) return false;
    const { password: _, ...safeUser } = match;
    setUser(safeUser);
    localStorage.setItem('settle_user', JSON.stringify(safeUser));
    return true;
  };

  const signup = (name, email, targetCity) => {
    const newUser = { id: Date.now().toString(), name, email, targetCity };
    setUser(newUser);
    localStorage.setItem('settle_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('settle_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
