import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  CheckSquare, 
  Bell, 
  Settings, 
  LogOut,
  BarChart3,
  MapPin,
  Award,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Logo from '../common/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-soft-lg border-r border-neutral-200 flex flex-col transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo and Close Button */}
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <Logo size="md" />
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-neutral-200 bg-gradient-to-br from-sky-50 to-sky-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-neutral-600 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:bg-sky-50 hover:text-sky-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-sky-600 hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;