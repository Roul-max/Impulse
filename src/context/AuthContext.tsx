import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../../types';
import { ApiService } from '../../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Check for existing session (basic check via localStorage for UI)
    // A robust app would hit an /api/auth/me endpoint here
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const userData = await ApiService.login(credentials);
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      showToast(`Welcome back, ${userData.name}!`, 'success');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const userData = await ApiService.register(credentials);
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      showToast('Account created successfully!', 'success');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
        await ApiService.logout();
    } catch (e) {
        console.error(e);
    }
    setUser(null);
    localStorage.removeItem('userInfo');
    // Clear cart in cart context (handled by page reload or context reset)
    window.location.href = '/#/login'; 
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};