import React from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  activeAlerts: number;
}

export const Header: React.FC<HeaderProps> = ({ activeAlerts }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SafeTrails</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
            {activeAlerts > 0 && (
              <Badge 
                variant="danger" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {activeAlerts}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
          
          <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>
      </div>
    </header>
  );
};
