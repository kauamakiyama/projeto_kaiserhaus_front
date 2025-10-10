import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface User {
  id?: string;
  nome?: string;
  email?: string;
  hierarquia?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      // ignore storage errors
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const login = (newToken: string, userData?: User) => {
    setToken(newToken);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Limpa o carrinho ao fazer logout
    try {
      localStorage.removeItem('kaizerhaus-cart');
    } catch (error) {
      console.error('Erro ao limpar carrinho no logout:', error);
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    login,
    logout,
  }), [token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};


