import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Shield,
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tourists', label: 'Tourists', icon: Users },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'heatmap', label: 'Heatmap', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (itemId: string) => {
    onTabChange(itemId);
    
    // Navigate to specific routes for certain items
    switch (itemId) {
      case 'overview':
        navigate('/');
        break;
      case 'tourists':
      case 'alerts':
      case 'heatmap':
      case 'analytics':
      case 'reports':
      case 'settings':
        // These will be handled by the main content area
        break;
      default:
        navigate('/');
    }
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Shield className="h-6 w-6 text-primary-600" />
          <span className="text-lg font-semibold text-gray-900">Safety System</span>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'overview' && location.pathname === '/') ||
              (item.id === 'tourists' && location.pathname.startsWith('/tourist/')) ||
              (item.id === 'alerts' && location.pathname.startsWith('/alert/'));
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                  isActive
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
