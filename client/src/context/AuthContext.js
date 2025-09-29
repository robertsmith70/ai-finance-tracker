import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session on mount
    (async () => {
      try {
        const { data } = await api.post('/auth/verify');
        if (data?.status && data?.user) setUser(data.user);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    const { data } = await api.post('/auth/verify');
    setUser(data.user);
  };

  const signup = async (payload) => {
    await api.post('/auth/signup', payload);
    const { data } = await api.post('/auth/verify');
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
