import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Compass,
  FileText,
  Navigation,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tourists', label: 'Tourists', icon: Users },
  { id: 'trips', label: 'Active Trips', icon: Navigation },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'heatmap', label: 'Heatmap', icon: MapPin },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isMobileMenuOpen, onMobileMenuClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (itemId: string) => {
    onTabChange(itemId);
    // Close mobile menu when navigating
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
    
    // Navigate to specific routes for certain items
    switch (itemId) {
      case 'overview':
        navigate('/dashboard');
        break;
      case 'tourists':
        navigate('/dashboard/tourists');
        break;
      case 'trips':
        navigate('/dashboard/trips');
        break;
      case 'alerts':
        navigate('/dashboard/alerts');
        break;
      case 'heatmap':
        navigate('/dashboard/heatmap');
        break;
      case 'analytics':
        navigate('/dashboard/analytics');
        break;
      case 'reports':
        navigate('/dashboard/reports');
        break;
      case 'settings':
        navigate('/dashboard/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onMobileMenuClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 h-full transform transition-transform duration-300 ease-in-out lg:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 sm:p-6">
          {/* Mobile Close Button */}
          {onMobileMenuClose && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <div className="flex items-center space-x-2">
                <Compass className="h-6 w-6 text-primary-600" />
                <span className="text-lg font-semibold text-gray-900">Tourist Safety</span>
              </div>
              <button
                onClick={onMobileMenuClose}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center space-x-2 mb-8">
            <Compass className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">Tourist Safety</span>
          </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'overview' && location.pathname === '/dashboard') ||
              (item.id === item.id && location.pathname === `/dashboard/${item.id}`) ||
              (item.id === 'tourists' && location.pathname.startsWith('/dashboard/tourist/')) ||
              (item.id === 'trips' && location.pathname.startsWith('/dashboard/trip/')) ||
              (item.id === 'alerts' && location.pathname.startsWith('/dashboard/alert/'));
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-3 sm:py-2 rounded-lg text-left transition-colors duration-200 min-h-[44px] touch-manipulation',
                  isActive
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
};
