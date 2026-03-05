import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, ChevronDown, Menu, Sun, Moon, Globe, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../../services/api';
import GlobalSearch from '../common/GlobalSearch';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '../../contexts/LanguageContext';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout }             = useAuth();
  const { theme, toggleTheme }       = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { connectionStatus }         = useWebSocket();
  const navigate = useNavigate();

  const [showUserMenu,  setShowUserMenu]  = useState(false);
  const [showSearch,    setShowSearch]    = useState(false);
  const [showLangMenu,  setShowLangMenu]  = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setShowLangMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user?.userId) return;
    notificationsApi.getUnreadCount(user.userId)
      .then((r) => setUnreadCount(r.data || 0))
      .catch(() => setUnreadCount(0));
  }, [user?.userId]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.code === language);

  // B&W WebSocket status — uses density rather than hue
  const wsStatusConfig = {
    connected:    { icon: Wifi,    color: 'text-gray-900 dark:text-white',         title: 'Real-time: Connected' },
    connecting:   { icon: Wifi,    color: 'text-gray-500 animate-pulse',            title: 'Real-time: Connecting…' },
    disconnected: { icon: WifiOff, color: 'text-gray-300 dark:text-slate-600',     title: 'Real-time: Disconnected' },
    error:        { icon: WifiOff, color: 'text-black dark:text-white',            title: 'Real-time: Error' },
    unsupported:  { icon: WifiOff, color: 'text-gray-300 dark:text-slate-600',     title: 'Real-time: Not supported' },
  } as const;

  const wsStatus = wsStatusConfig[connectionStatus] ?? wsStatusConfig.disconnected;
  const WsIcon   = wsStatus.icon;

  return (
    <header className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg shadow-crisp border-b border-gray-100 dark:border-slate-700/60 px-3 sm:px-4 lg:px-6 py-3 sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2">

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500 dark:text-slate-400 flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder={t('misc_search_placeholder')}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl
                bg-gray-50 dark:bg-slate-800
                text-gray-900 dark:text-slate-100
                placeholder:text-gray-400 dark:placeholder:text-slate-500
                focus:bg-white dark:focus:bg-slate-700
                focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300
                focus:border-gray-900 dark:focus:border-gray-300
                transition-all duration-200 text-sm outline-none"
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <GlobalSearch onClose={() => setShowSearch(false)} />
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">

          {/* WebSocket indicator */}
          <div className="hidden sm:flex" title={wsStatus.title}>
            <WsIcon className={`w-4 h-4 ${wsStatus.color}`} />
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu((p) => !p)}
              className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-1"
              title="Switch language"
              aria-label="Language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-semibold">{currentLang?.flag}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 py-2 z-50 animate-slide-down">
                <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  {t('common_language')}
                </p>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-all
                      hover:bg-gray-50 dark:hover:bg-slate-700
                      ${lang.code === language
                        ? 'text-gray-900 dark:text-white font-bold bg-gray-50/80 dark:bg-slate-700/50'
                        : 'text-gray-600 dark:text-slate-300'
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.code === language && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] rounded-full flex items-center justify-center font-bold shadow-crisp px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center shadow-crisp">
                  <span className="text-white dark:text-gray-900 font-display font-bold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white dark:border-slate-900 rounded-full" title="Online" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 capitalize leading-tight">{user?.role?.toLowerCase()}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 py-2 z-50 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('section_account')}
                  </p>
                </div>
                {[
                  { label: t('nav_profile'),  icon: User,     to: '/profile' },
                  { label: t('nav_settings'), icon: Settings, to: '/settings' },
                ].map((item) => (
                  <button
                    key={item.to}
                    onClick={() => { navigate(item.to); setShowUserMenu(false); }}
                    className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200
                      hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white
                      transition-all rounded-lg"
                  >
                    <item.icon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-slate-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium
                    text-gray-400 dark:text-slate-500
                    hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-300
                    transition-all rounded-lg"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{t('nav_sign_out')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
