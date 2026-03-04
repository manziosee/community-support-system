import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, CheckSquare, Clock, Award, Bell, MapPin,
  Plus, ChevronRight, ArrowRight, Target, Zap, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi, requestsApi, notificationsApi } from '../../services/api';
import type { Assignment, Request, Notification, VolunteerAnalytics } from '../../types';
import StatusChart from '../../components/charts/StatusChart';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressRing from '../../components/dashboard/ProgressRing';
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

const VolunteerDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableRequests, setAvailableRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalAssignments: 0, activeAssignments: 0, completedAssignments: 0,
    availableRequests: 0, unreadNotifications: 0,
  });
  const [analyticsData, setAnalyticsData] = useState<VolunteerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (user?.userId) refreshUser(); }, []); // eslint-disable-line

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [assignmentsResponse, requestsResponse, notificationsResponse, unreadCountResponse] = await Promise.all([
          assignmentsApi.getByVolunteer(user.userId),
          requestsApi.getPending(),
          notificationsApi.getByUser(user.userId),
          notificationsApi.getUnreadCount(user.userId),
        ]);

        const userAssignments = assignmentsResponse.data;
        const pendingRequests = requestsResponse.data;

        setAssignments(userAssignments.slice(0, 5));
        setAvailableRequests(pendingRequests.slice(0, 5));
        setNotifications(notificationsResponse.data.slice(0, 5));

        const totalAssignments = userAssignments.length;
        const activeAssignments = userAssignments.filter((a: Assignment) => !a.completedAt).length;
        const completedAssignments = userAssignments.filter((a: Assignment) => a.completedAt).length;

        setStats({ totalAssignments, activeAssignments, completedAssignments, availableRequests: pendingRequests.length, unreadNotifications: unreadCountResponse.data });

        const statusBreakdown = [
          activeAssignments > 0    ? { status: 'Active',    count: activeAssignments }    : null,
          completedAssignments > 0 ? { status: 'Completed', count: completedAssignments } : null,
        ].filter(Boolean) as { status: string; count: number }[];

        setAnalyticsData({ totalAssignments, activeAssignments, completedAssignments, statusBreakdown });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({ totalAssignments: 0, activeAssignments: 0, completedAssignments: 0, availableRequests: 0, unreadNotifications: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) return <LoadingSpinner size="lg" text="Loading your dashboard…" />;

  const completionRate = stats.totalAssignments > 0
    ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100) : 0;

  const locationStr = [user?.district || user?.location?.district, user?.province || user?.location?.province]
    .filter(Boolean).join(', ');

  const skills = user?.skills ?? [];

  const impactItems = [
    {
      label: 'Completed',
      count: stats.completedAssignments,
      pct: completionRate,
      bar: 'bg-green-400',
      icon: Award,
      color: 'text-green-700 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-100 dark:border-green-800/30',
      desc: `${completionRate}% completion rate`,
    },
    {
      label: 'Active',
      count: stats.activeAssignments,
      pct: stats.totalAssignments > 0 ? Math.round((stats.activeAssignments / stats.totalAssignments) * 100) : 0,
      bar: 'bg-orange-400',
      icon: Clock,
      color: 'text-orange-700 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-100 dark:border-orange-800/30',
      desc: 'In progress now',
    },
    {
      label: 'Available',
      count: stats.availableRequests,
      pct: 100,
      bar: 'bg-purple-400',
      icon: Target,
      color: 'text-purple-700 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-100 dark:border-purple-800/30',
      desc: 'Requests awaiting help',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-600 text-white shadow-soft-lg">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-primary-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left: user info */}
            <div className="flex-1">
              <p className="text-secondary-200 text-sm font-medium mb-1">{getGreeting()} 🤝</p>
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold mb-2 leading-tight">{user?.name}</h1>
              {locationStr && (
                <p className="flex items-center gap-1.5 text-white/70 text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{locationStr}
                </p>
              )}

              {/* Skills */}
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 4).map((s) => (
                    <span
                      key={s.skillId}
                      className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2.5 py-1 rounded-full font-medium"
                    >
                      <Zap className="w-3 h-3" />{s.skillName}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span className="text-xs text-white/60 self-center">+{skills.length - 4} more</span>
                  )}
                </div>
              ) : (
                <Link to="/profile">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 border border-white/30 text-white px-3 py-1.5 rounded-full font-medium hover:bg-white dark:hover:bg-gray-800/30 transition-colors">
                    <Plus className="w-3 h-3" />Add your skills
                  </span>
                </Link>
              )}
            </div>

            {/* Right: completion ring + actions */}
            <div className="flex items-center gap-6">
              <div className="text-center hidden sm:flex flex-col items-center">
                <ProgressRing value={completionRate} size={88} strokeWidth={8} color="#ffffff" trackColor="rgba(255,255,255,0.2)" />
                <p className="text-sm font-bold text-white mt-1.5">{completionRate}%</p>
                <p className="text-xs text-white/60">Completion</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link to="/requests/available">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-white text-secondary-700 px-5 py-2.5 rounded-xl shadow-md font-bold text-sm hover:bg-secondary-50 hover:scale-105 transition-all duration-200 w-full justify-center"
                  >
                    <FileText className="w-4 h-4" />Browse Requests
                  </button>
                </Link>
                <Link to="/profile">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white dark:hover:bg-gray-800/30 text-white border border-white/30 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />Update Skills
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <StatCard title="Total Assignments" value={stats.totalAssignments}     icon={CheckSquare} color="blue"   link="/assignments" />
        <StatCard title="Active"            value={stats.activeAssignments}    icon={Clock}       color="orange" />
        <StatCard title="Completed"         value={stats.completedAssignments} icon={Award}       color="green" />
        <StatCard title="Available"         value={stats.availableRequests}    icon={FileText}    color="purple" link="/requests/available" />
        <StatCard title="Notifications"     value={stats.unreadNotifications}  icon={Bell}        color="red"    link="/notifications" />
      </div>

      {/* ── Impact Section ───────────────────────────────────────────── */}
      {stats.totalAssignments > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm p-5 transition-colors duration-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">Your Impact</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mt-0.5">How you're helping the community</p>
            </div>
            <TrendingUp className="w-5 h-5 text-neutral-300 dark:text-slate-600" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {impactItems.map((item) => (
              <div
                key={item.label}
                className={`${item.bg} border ${item.border} rounded-xl p-4 relative overflow-hidden transition-colors duration-200`}
              >
                {/* Watermark icon */}
                <item.icon className={`absolute -bottom-2 -right-2 w-16 h-16 ${item.color} opacity-[0.1] pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className={`text-2xl font-display font-black ${item.color}`}>{item.count}</span>
                  </div>
                  <p className={`text-xs font-bold ${item.color} mb-2`}>{item.label}</p>
                  <div className="h-1.5 bg-white/60 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <ProgressBar pct={item.pct} colorClass={item.bar} />
                  </div>
                  <p className={`text-xs mt-1 ${item.color} opacity-70 font-medium`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Chart + Active Assignments ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {analyticsData?.statusBreakdown && analyticsData.statusBreakdown.length > 0 ? (
          <StatusChart data={analyticsData.statusBreakdown} title="Assignment Status" type="pie" />
        ) : (
          <SectionCard title="Assignment Status">
            <EmptyState icon={CheckSquare} title="No data yet" description="Your assignment statistics will appear here." size="sm" />
          </SectionCard>
        )}

        <SectionCard
          title="My Active Assignments"
          viewAllLink="/assignments"
          headerClassName="bg-gradient-to-r from-secondary-50 to-white dark:from-secondary-900/20 dark:to-slate-800"
        >
          {assignments.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No active assignments"
              description="Browse available requests to start helping your community."
              actionLabel="Browse Requests"
              onAction={() => { window.location.href = '/requests/available'; }}
              size="sm"
            />
          ) : (
            <div className="space-y-2.5">
              {assignments.map((a) => (
                <Link
                  key={a.assignmentId}
                  to={`/assignments/${a.assignmentId}`}
                  className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-slate-700 rounded-xl hover:border-secondary-300 dark:hover:border-secondary-600 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.completedAt ? 'bg-green-50 dark:bg-green-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
                    {a.completedAt
                      ? <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                      : <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate group-hover:text-secondary-700 dark:group-hover:text-secondary-400 group-hover:translate-x-0.5 transition-transform duration-200">
                      {a.request?.title || 'Assignment'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">{timeAgo(a.acceptedAt)}</p>
                  </div>
                  <Badge variant={a.completedAt ? 'success' : 'warning'}>{a.completedAt ? 'Done' : 'Active'}</Badge>
                  <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-secondary-400 flex-shrink-0" />
                </Link>
              ))}
              <Link
                to="/assignments"
                className="flex items-center justify-center gap-2 mt-2 py-2 text-xs font-semibold text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors"
              >
                View all assignments <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Available Requests + Notifications ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard
          title="Available Requests"
          viewAllLink="/requests/available"
          headerClassName="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800"
        >
          {availableRequests.length === 0 ? (
            <EmptyState icon={FileText} title="No available requests" description="Check back later for new requests from citizens." size="sm" />
          ) : (
            <div className="space-y-2.5">
              {availableRequests.map((req) => {
                const _catCfg = getCategoryConfig(req.category);
                const loc = req.citizen.location
                  ? `${req.citizen.location.district}, ${req.citizen.location.province}`
                  : `${req.citizen.district || ''}, ${req.citizen.province || ''}`;
                return (
                  <Link
                    key={req.requestId}
                    to={`/requests/${req.requestId}`}
                    className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-slate-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm transition-all duration-200 group"
                  >
                    <CategoryIcon category={req.category} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-transform duration-200">
                        {req.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {loc.trim().replace(/^,\s*|,\s*$/g, '') || 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-slate-400 flex-shrink-0">{timeAgo(req.createdAt)}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-purple-400 flex-shrink-0" />
                  </Link>
                );
              })}
              <Link
                to="/requests/available"
                className="flex items-center justify-center gap-2 mt-2 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                See all available <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent Notifications"
          viewAllLink="/notifications"
          headerClassName="bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-800"
        >
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="All caught up!" description="Notifications about your assignments will appear here." size="sm" />
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.notificationId}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    n.isRead
                      ? 'border-neutral-100 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                      : 'border-secondary-100 dark:border-secondary-700/40 bg-secondary-50 dark:bg-secondary-900/20'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.isRead ? 'bg-neutral-300 dark:bg-slate-600' : 'bg-secondary-500 animate-pulse'
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

      {/* ── Quick Action Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/requests/available', icon: FileText,    gradient: 'from-secondary-500 to-secondary-700', label: 'Browse Requests',  desc: 'Find requests matching your skills' },
          { to: '/assignments',        icon: CheckSquare, gradient: 'from-primary-500 to-primary-700',     label: 'My Assignments',   desc: 'Track your ongoing & completed work' },
          { to: '/profile',            icon: Award,       gradient: 'from-purple-500 to-purple-700',       label: 'Manage Skills',    desc: 'Update your expertise & profile' },
        ].map((action) => (
          <Link key={action.to} to={action.to}>
            <div className="group bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-soft hover:-translate-y-1 transition-all duration-300 text-center h-full flex flex-col items-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-1">{action.label}</h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400 leading-relaxed">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
