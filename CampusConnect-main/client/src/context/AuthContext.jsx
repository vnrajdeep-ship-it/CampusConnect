import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; } });
  const [loading, setLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('cc_token'); if (!token) { setLoading(false); return; } api.get('/auth/me').then(({ data }) => { setUser(data.user); localStorage.setItem('cc_user', JSON.stringify(data.user)); }).catch(() => { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setUser(null); }).finally(() => setLoading(false)); }, []);
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('cc_token', data.token); localStorage.setItem('cc_user', JSON.stringify(data.user)); setUser(data.user); };
  const register = async (details) => { const { data } = await api.post('/auth/register', details); localStorage.setItem('cc_token', data.token); localStorage.setItem('cc_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
