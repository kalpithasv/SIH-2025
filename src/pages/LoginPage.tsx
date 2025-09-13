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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            SafeTrails Admin Dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sign in to your account</h3>
          </div>
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Use Demo Admin Credentials
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Admin Account:</h3>
          <div className="text-xs text-blue-700">
            <p><strong>Email:</strong> admin@safetrails.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
