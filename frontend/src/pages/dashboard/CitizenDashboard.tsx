import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, Plus, Bell, MapPin,
  XCircle, ChevronRight, ArrowRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { requestsApi, notificationsApi } from '../../services/api';
import type { Request, Notification, CitizenAnalytics } from '../../types';
import StatusChart from '../../components/charts/StatusChart';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SectionCard from '../../components/dashboard/SectionCard';
import { timeAgo, getGreeting } from '../../utils/dateUtils';
import { CategoryIcon, getCategoryConfig } from '../../utils/categoryUtils';

/** Renders a progress bar whose width is set imperatively to avoid JSX inline styles. */
const ProgressBar: React.FC<{ pct: number; colorClass: string }> = ({ pct, colorClass }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }, [pct]);
  return <div ref={ref} className={`h-full ${colorClass} rounded-full transition-all duration-700`} />;
};

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0, pendingRequests: 0, completedRequests: 0,
    unreadNotifications: 0, acceptedRequests: 0, cancelledRequests: 0,
  });
  const [analyticsData, setAnalyticsData] = useState<CitizenAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [requestsResponse, notificationsResponse, unreadCountResponse] = await Promise.all([
          requestsApi.getByCitizen(user.userId),
          notificationsApi.getByUser(user.userId),
          notificationsApi.getUnreadCount(user.userId),
        ]);

        const userRequests = requestsResponse.data;
        setRequests(userRequests.slice(0, 5));
        setNotifications(notificationsResponse.data.slice(0, 5));

        const totalRequests = userRequests.length;
        const pendingRequests = userRequests.filter((r: Request) => r.status === 'PENDING').length;
        const acceptedRequests = userRequests.filter((r: Request) => r.status === 'ACCEPTED').length;
        const completedRequests = userRequests.filter((r: Request) => r.status === 'COMPLETED').length;
        const cancelledRequests = userRequests.filter((r: Request) => r.status === 'CANCELLED').length;

        setStats({ totalRequests, pendingRequests, completedRequests, acceptedRequests, cancelledRequests, unreadNotifications: unreadCountResponse.data });
        const statusBreakdown = [
          pendingRequests > 0   ? { status: 'Pending',   count: pendingRequests }   : null,
          acceptedRequests > 0  ? { status: 'Accepted',  count: acceptedRequests }  : null,
          completedRequests > 0 ? { status: 'Completed', count: completedRequests } : null,
          cancelledRequests > 0 ? { status: 'Cancelled', count: cancelledRequests } : null,
        ].filter(Boolean) as { status: string; count: number }[];
        setAnalyticsData({ totalRequests, pendingRequests, acceptedRequests, completedRequests, cancelledRequests, statusBreakdown });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) return <LoadingSpinner size="lg" text={t('citizen_loading')} />;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':   return 'warning';
      case 'ACCEPTED':  return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default:          return 'gray';
    }
  };

  const completionRate = stats.totalRequests > 0
    ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0;

  const locationStr = [user?.district || user?.location?.district, user?.province || user?.location?.province]
    .filter(Boolean).join(', ');

  // Journey stepper steps
  const journeySteps = [
    { label: t('status_pending'),   count: stats.pendingRequests,   icon: Clock,        color: 'bg-yellow-400',  ring: 'ring-yellow-200 dark:ring-yellow-800/40', iconColor: 'text-yellow-600 dark:text-yellow-400', textColor: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800/30' },
    { label: t('status_accepted'),  count: stats.acceptedRequests,  icon: CheckCircle,  color: 'bg-blue-400',    ring: 'ring-blue-200 dark:ring-blue-800/40',    iconColor: 'text-blue-600 dark:text-blue-400',     textColor: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-200 dark:border-blue-800/30' },
    { label: t('status_completed'), count: stats.completedRequests, icon: CheckCircle,  color: 'bg-green-400',   ring: 'ring-green-200 dark:ring-green-800/40',   iconColor: 'text-green-600 dark:text-green-400',   textColor: 'text-green-700 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-200 dark:border-green-800/30' },
    { label: t('status_cancelled'), count: stats.cancelledRequests, icon: XCircle,      color: 'bg-red-400',     ring: 'ring-red-200 dark:ring-red-800/40',       iconColor: 'text-red-600 dark:text-red-400',       textColor: 'text-red-700 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-soft-lg">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-6 lg:p-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex-1">
            <p className="text-gray-300 text-sm font-medium mb-1">{t(getGreeting() === 'Good morning' ? 'greeting_morning' : getGreeting() === 'Good afternoon' ? 'greeting_afternoon' : 'greeting_evening')} 👋</p>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold mb-2 leading-tight">{user?.name}</h1>
            {locationStr && (
              <p className="flex items-center gap-1.5 text-white/75 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{locationStr}
              </p>
            )}

            {/* Inline mini stats */}
            {stats.totalRequests > 0 && (
              <div className="flex flex-wrap gap-3">
                {[
                  { label: t('dashboard_total_requests'),       val: stats.totalRequests,                              color: 'text-white',        bg: 'bg-white/15' },
                  { label: t('dashboard_pending'), val: stats.pendingRequests + stats.acceptedRequests,   color: 'text-yellow-300',   bg: 'bg-yellow-400/20' },
                  { label: t('dashboard_completed'),        val: stats.completedRequests,                          color: 'text-green-300',    bg: 'bg-green-400/20' },
                  { label: t('citizen_completion'),  val: `${completionRate}%`,                             color: 'text-primary-200',  bg: 'bg-white/10' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2 text-center border border-white/10`}>
                    <span className={`font-display text-lg font-black ${s.color} leading-none block`}>{s.val}</span>
                    <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/requests/create" className="flex-shrink-0 self-start sm:self-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-5 py-3 rounded-xl shadow-md font-bold text-sm hover:bg-primary-50 hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              {t('nav_create_request')}
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('dashboard_total_requests')}  value={stats.totalRequests}        icon={FileText}     color="blue"   link="/requests" />
        <StatCard title={t('dashboard_pending')}         value={stats.pendingRequests}       icon={Clock}        color="yellow" />
        <StatCard title={t('dashboard_completed')}       value={stats.completedRequests}     icon={CheckCircle}  color="green" />
        <StatCard title={t('dashboard_notifications')}   value={stats.unreadNotifications}   icon={Bell}         color="red"    link="/notifications" subtitle={stats.unreadNotifications > 0 ? t('citizen_unread') : t('citizen_all_read')} />
      </div>

      {/* ── Request Journey Stepper ──────────────────────────────────── */}
      {stats.totalRequests > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm p-5 transition-colors duration-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Request Journey</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mt-0.5">Track where your requests stand</p>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-slate-400">{stats.totalRequests} {t('citizen_total_label')}</span>
          </div>

          {/* Desktop: horizontal stepper */}
          <div className="hidden sm:flex items-stretch gap-0">
            {journeySteps.map((step, idx) => {
              const pct = stats.totalRequests > 0 ? Math.round((step.count / stats.totalRequests) * 100) : 0;
              return (
                <div key={step.label} className="flex-1 flex items-stretch">
                  <div className={`flex-1 ${step.bg} border ${step.border} rounded-xl p-4 relative overflow-hidden`}>
                    {/* Background icon watermark */}
                    <step.icon className={`absolute -bottom-2 -right-2 w-16 h-16 ${step.iconColor} opacity-[0.12] pointer-events-none`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <step.icon className={`w-4 h-4 ${step.iconColor}`} />
                        <span className={`text-2xl font-display font-black ${step.textColor}`}>{step.count}</span>
                      </div>
                      <p className={`text-xs font-bold ${step.textColor} mb-2`}>{step.label}</p>
                      <div className="h-1 bg-white/60 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <ProgressBar pct={pct} colorClass={step.color} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${step.textColor} opacity-70`}>{pct}%</p>
                    </div>
                  </div>
                  {idx < journeySteps.length - 1 && (
                    <div className="flex items-center px-1">
                      <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: 2-column grid */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {journeySteps.map((step) => {
              const pct = stats.totalRequests > 0 ? Math.round((step.count / stats.totalRequests) * 100) : 0;
              return (
                <div key={step.label} className={`${step.bg} border ${step.border} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold ${step.textColor}`}>{step.label}</span>
                    <span className={`text-xl font-display font-black ${step.textColor}`}>{step.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/60 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <ProgressBar pct={pct} colorClass={step.color} />
                  </div>
                  <p className={`text-xs mt-1 ${step.textColor} opacity-70`}>{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Chart + Recent Requests ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsData?.statusBreakdown && analyticsData.statusBreakdown.length > 0 ? (
          <StatusChart data={analyticsData.statusBreakdown} title={t('dashboard_status_breakdown')} type="pie" />
        ) : (
          <SectionCard title={t('dashboard_status_breakdown')}>
            <EmptyState icon={FileText} title={t('misc_no_data')} description={t('citizen_stats_appear')} size="sm" />
          </SectionCard>
        )}

        <SectionCard
          title={t('dashboard_recent_requests')}
          viewAllLink="/requests"
          headerClassName="bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-800/80 dark:to-transparent"
        >
          {requests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t('citizen_no_requests_title')}
              description={t('citizen_no_requests_desc')}
              actionLabel={t('nav_create_request')}
              onAction={() => { window.location.href = '/requests/create'; }}
              size="sm"
            />
          ) : (
            <div className="space-y-2.5">
              {requests.map((request) => {
                const catCfg = getCategoryConfig(request.category);
                return (
                  <Link
                    key={request.requestId}
                    to={`/requests/${request.requestId}`}
                    className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-slate-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all duration-200 group"
                  >
                    <CategoryIcon category={request.category} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate group-hover:text-primary-700 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-transform duration-200">
                        {request.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                        {catCfg.label} · {timeAgo(request.createdAt)}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
                    <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-primary-400 flex-shrink-0" />
                  </Link>
                );
              })}
              <Link
                to="/requests"
                className="flex items-center justify-center gap-2 mt-2 py-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                {t('action_view_all')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Notifications + Quick Actions ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard
            title={t('dashboard_notifications')}
            viewAllLink="/notifications"
            headerClassName="bg-gradient-to-r from-accent-50 to-white dark:from-accent-900/10 dark:to-slate-800"
          >
            {notifications.length === 0 ? (
              <EmptyState icon={Bell} title={t('citizen_all_caught_up')} description={t('citizen_notif_empty_desc')} size="sm" />
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.notificationId}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      n.isRead
                        ? 'border-neutral-100 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                        : 'border-primary-100 dark:border-primary-700/40 bg-primary-50 dark:bg-primary-900/20'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.isRead ? 'bg-neutral-300 dark:bg-slate-600' : 'bg-primary-500 animate-pulse'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-slate-200 leading-snug">{n.message}</p>
                      <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest px-1">
            Quick Actions
          </h3>
          {[
            { to: '/requests/create', icon: Plus,     label: t('citizen_new_request'),   desc: t('citizen_new_request_desc'),     gradient: 'from-gray-900 to-black' },
            { to: '/requests',        icon: FileText,  label: t('nav_requests'),   desc: t('citizen_my_requests_desc'),     gradient: 'from-gray-700 to-gray-900' },
            { to: '/notifications',   icon: Bell,      label: t('nav_notifications'), desc: `${stats.unreadNotifications} ${t('citizen_unread')}`, gradient: 'from-gray-500 to-gray-700' },
          ].map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{action.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-slate-400">{action.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-primary-400 flex-shrink-0" />
              </div>
            </Link>
          ))}

          {/* Pro tip */}
          <div className="bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-colors duration-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gray-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 mb-1">Pro tip</p>
                <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
                  Add detailed descriptions to your requests to get matched with the right volunteers faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
