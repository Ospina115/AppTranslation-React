import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión al iniciar la app
    (async () => {
      const savedUser = await authService.getSession();
      setUser(savedUser);
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password });
    if (result.success) {
      await authService.saveSession(result.user);
      setUser(result.user);
    }
    return result;
  };

  const register = async (name, email, password) => {
    const result = await authService.register({ name, email, password });
    if (result.success) {
      await authService.saveSession(result.user);
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;
