import React from 'react';
import { Shield, Bell, User, Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  activeAlerts: number;
}

export const Header: React.FC<HeaderProps> = ({ activeAlerts }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Tourist Safety Dashboard</h1>
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
          
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
          
          <Settings className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900" />
        </div>
      </div>
    </header>
  );
};
