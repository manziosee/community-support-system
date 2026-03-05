import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Users, FileText, CheckSquare, Bell, Settings, LogOut,
  BarChart3, MapPin, Award, X, Plus, Zap, ChevronLeft,
  ChevronRight, Trophy, Users2, Calendar, BarChart2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserRole } from '../../types';
import { notificationsApi } from '../../services/api';
import { useGamification } from '../../contexts/GamificationContext';
import Logo from '../common/Logo';
import AvailabilityToggle from '../common/AvailabilityToggle';
import { LevelBadge } from '../common/BadgeDisplay';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
}

interface NavSection {
  label: string | null;
  items: NavItem[];
}

// B&W role badge — uses shade tiers to distinguish roles
const roleBadgeConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  ADMIN:     { label: 'Admin',     bg: 'bg-gray-900 dark:bg-gray-100',   text: 'text-white dark:text-gray-900', dot: 'bg-gray-400 dark:bg-gray-600' },
  VOLUNTEER: { label: 'Volunteer', bg: 'bg-gray-700 dark:bg-gray-200',   text: 'text-white dark:text-gray-800', dot: 'bg-gray-400 dark:bg-gray-500' },
  CITIZEN:   { label: 'Citizen',   bg: 'bg-gray-100 dark:bg-gray-700',   text: 'text-gray-700 dark:text-gray-200', dot: 'bg-gray-400' },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const { profile } = useGamification();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationsApi.getUnreadCount(user.userId)
      .then((res) => setUnreadCount(res.data ?? 0))
      .catch(() => setUnreadCount(0));
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getNavigationSections = (): NavSection[] => {
    const mainItems: NavItem[] = [
      { to: '/dashboard', icon: Home, label: t('nav_dashboard') },
    ];
    const accountItems: NavItem[] = [
      { to: '/notifications', icon: Bell, label: t('nav_notifications') },
    ];

    if (hasRole(UserRole.CITIZEN)) {
      return [
        { label: null, items: mainItems },
        {
          label: t('section_my_services'),
          items: [
            { to: '/requests',        icon: FileText, label: t('nav_requests') },
            { to: '/requests/create', icon: Plus,     label: t('nav_create_request') },
          ],
        },
        {
          label: t('section_community'),
          items: [
            { to: '/community/bulletin', icon: Users2, label: t('nav_community') },
            { to: '/leaderboard',        icon: Trophy, label: t('nav_leaderboard') },
          ],
        },
        { label: t('section_account'), items: accountItems },
      ];
    }

    if (hasRole(UserRole.VOLUNTEER)) {
      return [
        { label: null, items: mainItems },
        {
          label: t('section_community'),
          items: [
            { to: '/requests/available',    icon: FileText,    label: t('nav_available_requests') },
            { to: '/assignments',           icon: CheckSquare, label: t('nav_assignments') },
            { to: '/volunteer/availability', icon: Calendar,   label: t('nav_availability') },
            { to: '/skills',                icon: Zap,         label: t('nav_my_skills') },
          ],
        },
        {
          label: t('section_achievements'),
          items: [
            { to: '/achievements',       icon: Award,  label: t('nav_achievements') },
            { to: '/leaderboard',        icon: Trophy, label: t('nav_leaderboard') },
            { to: '/community/bulletin', icon: Users2, label: t('nav_community') },
          ],
        },
        { label: t('section_account'), items: accountItems },
      ];
    }

    if (hasRole(UserRole.ADMIN)) {
      return [
        { label: null, items: mainItems },
        {
          label: t('section_users'),
          items: [
            { to: '/admin/users', icon: Users, label: t('nav_user_management') },
          ],
        },
        {
          label: t('section_requests'),
          items: [
            { to: '/admin/requests',    icon: FileText,    label: t('nav_requests') },
            { to: '/admin/assignments', icon: CheckSquare, label: t('nav_assignments') },
          ],
        },
        {
          label: t('section_system'),
          items: [
            { to: '/admin/skills',    icon: Award,    label: t('nav_skill_management') },
            { to: '/admin/locations', icon: MapPin,   label: t('nav_locations') },
            { to: '/admin/analytics', icon: BarChart3,label: t('nav_analytics') },
            { to: '/admin/reports',   icon: BarChart2,label: t('nav_advanced_reports') },
            { to: '/admin/settings',  icon: Settings, label: t('nav_system_settings') },
          ],
        },
        {
          label: t('section_community'),
          items: [
            { to: '/leaderboard',        icon: Trophy, label: t('nav_leaderboard') },
            { to: '/community/bulletin', icon: Users2, label: t('nav_community') },
          ],
        },
        { label: t('section_account'), items: accountItems },
      ];
    }

    return [{ label: null, items: [...mainItems, ...accountItems] }];
  };

  const sections    = getNavigationSections();
  const roleConfig  = user?.role ? (roleBadgeConfig[user.role] ?? roleBadgeConfig.CITIZEN) : roleBadgeConfig.CITIZEN;

  // B&W nav link — active = solid black pill; inactive = subtle hover
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${
      isActive
        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-crisp'
        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-white dark:bg-slate-900
        shadow-soft dark:shadow-none
        border-r border-gray-100 dark:border-slate-700/60
        flex flex-col transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className={`px-4 py-5 border-b border-gray-100 dark:border-slate-700/60 flex items-center flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <Logo size="sm" />}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center shadow-crisp">
            <span className="text-white dark:text-gray-900 font-bold text-xs">CS</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed
              ? <ChevronRight className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              : <ChevronLeft  className="w-5 h-5 text-gray-500 dark:text-slate-400" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* ── User Info ─────────────────────────────────────────────────────── */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-700/60 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700/40">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center shadow-crisp">
                <span className="text-white dark:text-gray-900 font-display font-bold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-white dark:border-slate-800 rounded-full" title="Online" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate leading-tight">{user?.name}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${roleConfig.bg} ${roleConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`} />
                {roleConfig.label}
              </span>
            </div>
          </div>

          {/* Volunteer gamification mini-bar */}
          {hasRole(UserRole.VOLUNTEER) && profile && (
            <div className="mt-2.5 px-1">
              <div className="flex items-center justify-between mb-1.5">
                <LevelBadge level={profile.level} size="sm" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{profile.points} pts</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden border border-gray-200 dark:border-slate-600">
                <div
                  className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (profile.points % 100))}%` }}
                />
              </div>
            </div>
          )}

          {/* Volunteer availability toggle */}
          {hasRole(UserRole.VOLUNTEER) && !isCollapsed && (
            <div className="mt-2.5">
              <AvailabilityToggle compact={false} />
            </div>
          )}
        </div>
      )}

      {/* ── Collapsed Avatar ──────────────────────────────────────────────── */}
      {isCollapsed && (
        <div className="px-2 py-3 border-b border-gray-100 dark:border-slate-700/60 flex-shrink-0 flex justify-center">
          <div className="relative" title={user?.name}>
            <div className="w-9 h-9 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center shadow-crisp">
              <span className="text-white dark:text-gray-900 font-bold text-sm">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? 'pt-2' : ''}>
            {section.label && !isCollapsed && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">
                {section.label}
              </p>
            )}
            {section.label && isCollapsed && (
              <div className="border-t border-gray-100 dark:border-slate-800 mx-1 my-1" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isBell = item.icon === Bell;
                const badge  = isBell && unreadCount > 0 ? unreadCount : 0;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navLinkClass}
                    onClick={onClose}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="relative flex-shrink-0">
                      <item.icon className="w-[1.125rem] h-[1.125rem]" />
                      {badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                    </span>
                    {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    {!isCollapsed && badge > 0 && (
                      <span className="ml-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                        {badge > 99 ? '99+' : badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom Actions ────────────────────────────────────────────────── */}
      <div className="px-2 py-3 border-t border-gray-100 dark:border-slate-700/60 flex-shrink-0 space-y-0.5">
        <NavLink to="/profile" className={navLinkClass} title={isCollapsed ? t('nav_profile_settings') : undefined}>
          <Settings className="flex-shrink-0 w-[1.125rem] h-[1.125rem]" />
          {!isCollapsed && <span>{t('nav_profile_settings')}</span>}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? t('nav_sign_out') : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-gray-400 dark:text-slate-500
            hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-300
            transition-all duration-200 w-full ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="flex-shrink-0 w-[1.125rem] h-[1.125rem]" />
          {!isCollapsed && <span>{t('nav_sign_out')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
