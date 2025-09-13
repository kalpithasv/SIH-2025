import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { User, LoginRequest } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  adminLogin: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AuthContext: Checking initial auth state...');
      const token = localStorage.getItem('authToken');
      console.log('🔑 AuthContext: Token found in localStorage:', !!token);
      
      if (token) {
        try {
          console.log('👤 AuthContext: Fetching user profile...');
          const response = await apiService.getProfile();
          console.log('✅ AuthContext: Profile fetched successfully:', response.user);
          setUser(response.user);
        } catch (error) {
          console.error('❌ AuthContext: Auth check failed:', error);
          console.log('🧽 AuthContext: Clearing invalid token from localStorage');
          localStorage.removeItem('authToken');
          apiService.clearToken();
        }
      } else {
        console.log('💫 AuthContext: No token found, user not authenticated');
      }
      
      console.log('🏁 AuthContext: Auth check completed');
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (_credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      // For regular user login
      const response = await apiService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = (user: User, token: string) => {
    console.log('🔐 AdminLogin: Setting user in context:', user);
    apiService.setToken(token);
    setUser(user);
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      await apiService.updateProfile(userData);
      if (user) {
        setUser({ ...user, ...userData });
      }
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    adminLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
