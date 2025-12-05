import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  CheckSquare, 
  Bell, 
  Settings, 
  HelpCircle,
  BarChart3,
  MapPin,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const Sidebar: React.FC = () => {
  const { user, hasRole } = useAuth();

  const getNavigationItems = () => {
    const commonItems = [
      { to: '/dashboard', icon: Home, label: 'Dashboard' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
    ];

    if (hasRole(UserRole.CITIZEN)) {
      return [
        ...commonItems,
        { to: '/requests', icon: FileText, label: 'My Requests' },
        { to: '/requests/create', icon: FileText, label: 'Create Request' },
      ];
    }

    if (hasRole(UserRole.VOLUNTEER)) {
      return [
        ...commonItems,
        { to: '/requests/available', icon: FileText, label: 'Available Requests' },
        { to: '/assignments', icon: CheckSquare, label: 'My Assignments' },
        { to: '/skills', icon: Award, label: 'My Skills' },
      ];
    }

    if (hasRole(UserRole.ADMIN)) {
      return [
        ...commonItems,
        { to: '/admin/users', icon: Users, label: 'User Management' },
        { to: '/admin/requests', icon: FileText, label: 'Request Management' },
        { to: '/admin/assignments', icon: CheckSquare, label: 'Assignment Management' },
        { to: '/admin/skills', icon: Award, label: 'Skill Management' },
        { to: '/admin/locations', icon: MapPin, label: 'Location Management' },
        { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/admin/settings', icon: Settings, label: 'System Settings' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Community</h1>
            <p className="text-sm text-gray-500">Support System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/help"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;