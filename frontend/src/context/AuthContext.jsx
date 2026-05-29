import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('sc_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (!token) { setLoading(false); return; }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('sc_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const register = async (nombre, email, password, telefono) => {
    const res = await api.post('/auth/register', { nombre, email, password, telefono });
    const { token, user: userData } = res.data;
    localStorage.setItem('sc_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const isAdmin     = user?.rol === 'admin';
  const isOperator  = ['admin', 'operador'].includes(user?.rol);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isOperator }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
