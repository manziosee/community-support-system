import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { UserRole } from '../types';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock users for testing
      const mockUsers = {
        'admin@community.rw': {
          token: 'mock-admin-token',
          user: {
            userId: 1,
            name: 'Admin User',
            email: 'admin@community.rw',
            phoneNumber: '+250788123456',
            role: UserRole.ADMIN,
            createdAt: '2024-01-01T00:00:00Z',
            location: {
              locationId: 1,
              province: 'Kigali City',
              district: 'Gasabo',
              provinceCode: 'KG01'
            },
            sector: 'Kimironko',
            cell: 'Bibare',
            village: 'Kamatamu'
          }
        },
        'volunteer@community.rw': {
          token: 'mock-volunteer-token',
          user: {
            userId: 2,
            name: 'John Volunteer',
            email: 'volunteer@community.rw',
            phoneNumber: '+250788654321',
            role: UserRole.VOLUNTEER,
            createdAt: '2024-01-01T00:00:00Z',
            location: {
              locationId: 2,
              province: 'Eastern Province',
              district: 'Nyagatare',
              provinceCode: 'EP01'
            },
            sector: 'Nyagatare',
            cell: 'Rwempasha',
            village: 'Karama',
            skills: [
              { skillId: 1, skillName: 'Programming', description: 'Software development' },
              { skillId: 2, skillName: 'Tutoring', description: 'Academic support' }
            ]
          }
        },
        'citizen@community.rw': {
          token: 'mock-citizen-token',
          user: {
            userId: 3,
            name: 'Jane Citizen',
            email: 'citizen@community.rw',
            phoneNumber: '+250788987654',
            role: UserRole.CITIZEN,
            createdAt: '2024-01-01T00:00:00Z',
            location: {
              locationId: 3,
              province: 'Southern Province',
              district: 'Huye',
              provinceCode: 'SP03'
            },
            sector: 'Tumba',
            cell: 'Matyazo',
            village: 'Cyarwa'
          }
        }
      };
      
      // Check if it's a mock user
      const mockUser = mockUsers[email as keyof typeof mockUsers];
      if (mockUser && (password === 'admin123' || password === 'volunteer123' || password === 'citizen123')) {
        const { token: authToken, user: userData } = mockUser;
        
        setToken(authToken);
        setUser(userData);
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success(`Login successful! Welcome ${userData.name}`);
        return;
      }
      
      // Try real API if not a mock user
      const response = await authApi.login({ email, password });
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      const { token: authToken, user: newUser } = response.data;
      
      setToken(authToken);
      setUser(newUser);
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
    isAuthenticated: !!user && !!token,
    isLoading,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};