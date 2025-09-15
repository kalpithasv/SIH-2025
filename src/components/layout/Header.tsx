import React from 'react';
import { Bell, User, Settings, LogOut, Menu } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  activeAlerts: number;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeAlerts, onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">SafeTrails</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            {activeAlerts > 0 && (
              <Badge 
                variant="danger" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {activeAlerts}
              </Badge>
            )}
          </div>
          
          {/* User Info - Hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </span>
          </div>
          
          {/* Mobile User Button */}
          <div className="sm:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <User className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Logout"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
          
          {/* Settings - Hidden on mobile */}
          <button className="hidden sm:block p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
