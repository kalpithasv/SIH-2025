import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🚀 Login Form Submitted:', { email: credentials.email });

    try {
      // Use admin login API
      console.log('📞 Calling adminLogin API...');
      const response = await apiService.adminLogin(credentials);
      console.log('✅ AdminLogin API Response:', response);
      
      if (response.token && response.user) {
        console.log('🔑 Token and user received, updating auth context...');
        
        // Use the new adminLogin method that doesn't require profile fetch
        console.log('👤 Calling auth.adminLogin to update context...');
        auth.adminLogin(response.user, response.token);
        console.log('🎉 Auth context updated successfully!');
        
        // Navigate to dashboard
        console.log('🧭 Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('❌ No token in response:', response);
        setError('Login successful but no authentication token received');
      }
    } catch (error: any) {
      console.error('💥 Login failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Admin login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
      console.log('🏁 Login attempt completed');
    }
  };

  const handleDemoLogin = async () => {
    setCredentials({
      email: 'admin@safetrails.com',
      password: 'admin123',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="h-12 w-12 sm:h-16 sm:w-16 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            SafeTrails Admin Dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sign in to your account</h3>
          </div>
          <div>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, email: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base sm:text-sm min-h-[48px]"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredentials({ ...credentials, password: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base sm:text-sm min-h-[48px]"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base min-h-[48px] transition-colors duration-200 touch-manipulation"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-sm text-primary-600 hover:text-primary-500 py-2 px-3 rounded-md transition-colors duration-200 min-h-[40px] touch-manipulation"
                >
                  Use Demo Admin Credentials
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Admin Account:</h3>
          <div className="text-xs sm:text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> <span className="break-all">admin@safetrails.com</span></p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
