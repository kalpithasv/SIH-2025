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
      const storedUser = localStorage.getItem('authUser');
      console.log('🔑 AuthContext: Token found in localStorage:', !!token);
      console.log('👤 AuthContext: User found in localStorage:', !!storedUser);
      
      if (token && storedUser) {
        try {
          // First try to restore from localStorage
          const user = JSON.parse(storedUser);
          console.log('📦 AuthContext: Restoring user from localStorage:', user);
          apiService.setToken(token);
          setUser(user);
          
          // Optional: Validate token with server in background
          // If this fails, we'll catch it but won't clear the user immediately
          try {
            console.log('🔄 AuthContext: Validating token with server...');
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Token validation timeout')), 10000)
            );
            
            const response = await Promise.race([
              apiService.getProfile(),
              timeoutPromise
            ]) as { user: User };
            
            console.log('✅ AuthContext: Token validation successful:', response.user);
            // Update user data if server returns updated info
            setUser(response.user);
            // Update localStorage with fresh user data
            localStorage.setItem('authUser', JSON.stringify(response.user));
          } catch (validationError) {
            console.warn('⚠️ AuthContext: Token validation failed, but keeping user logged in:', validationError);
            // We keep the user logged in even if validation fails
            // This prevents constant logouts due to server issues
          }
        } catch (error) {
          console.error('❌ AuthContext: Failed to restore user from localStorage:', error);
          console.log('🧽 AuthContext: Clearing invalid data from localStorage');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          apiService.clearToken();
        }
      } else if (token) {
        // We have token but no stored user, try to fetch profile
        try {
          console.log('👤 AuthContext: Fetching user profile with existing token...');
          apiService.setToken(token);
          const response = await apiService.getProfile();
          console.log('✅ AuthContext: Profile fetched successfully:', response.user);
          setUser(response.user);
          // Store user data in localStorage for next time
          localStorage.setItem('authUser', JSON.stringify(response.user));
        } catch (error) {
          console.error('❌ AuthContext: Auth check failed:', error);
          console.log('🧽 AuthContext: Clearing invalid token from localStorage');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
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
    // Store user data in localStorage for persistence
    localStorage.setItem('authUser', JSON.stringify(user));
    console.log('📦 AdminLogin: User data stored in localStorage');
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
    // Clear user data from localStorage
    localStorage.removeItem('authUser');
    console.log('🧽 Logout: Cleared user data from localStorage');
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
