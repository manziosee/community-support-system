import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { UserRole } from '../types';
import { authApi, usersApi } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, otpCode?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await usersApi.getById(user.userId);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (email: string, password: string, otpCode?: string) => {
    try {
      setIsLoading(true);
      
      // Use real API for authentication
      const response = await authApi.login({ 
        email, 
        password, 
        twoFactorCode: otpCode 
      });
      const { token: authToken, user: userData, requires2FA } = response.data;
      
      if (requires2FA) {
        throw { response: { data: { requires2FA: true, message: 'OTP verification required' } } };
      }
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Refresh user data to get complete profile with skills
      setTimeout(() => {
        refreshUser();
      }, 100);
      
      toast.success('Login successful!');
    } catch (error: any) {
      if (error.response?.data?.requires2FA || error.response?.data?.message === 'OTP verification required') {
        throw { response: { data: { message: 'OTP verification required' } } };
      }
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      if (errorMessage.includes('verify your email')) {
        throw { message: errorMessage };
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      // Don't automatically log in - user needs to verify email first
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!token,
    isLoading,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};