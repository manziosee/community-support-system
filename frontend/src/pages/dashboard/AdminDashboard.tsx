import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users, FileText, CheckSquare, TrendingUp, Award,
  Activity, Settings, MapPin, BarChart3, ChevronRight, Shield, Zap,
  UserCheck, AlertCircle, CircleCheck, Clock, Download,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { adminApi } from '../../services/api';
import type { DashboardStats } from '../../types';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { exportToCSV } from '../../utils/exportUtils';
import SectionCard from '../../components/dashboard/SectionCard';
import { useTheme } from '../../contexts/ThemeContext';

const ProgressBar: React.FC<{ pct: number; colorClass: string }> = ({ pct, colorClass }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }, [pct]);
  return <div ref={ref} className={`h-full ${colorClass} rounded-full transition-all duration-700`} />;
};

interface ExtendedStats extends DashboardStats { completedAssignments?: number; }

const PIE_COLORS_USERS = ['#0d9488', '#6366f1', '#8b5cf6'];
const PIE_COLORS_REQUESTS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.07) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [stats, setStats] = useState<ExtendedStats>({
    totalUsers: 0, totalVolunteers: 0, totalCitizens: 0,
    totalRequests: 0, pendingRequests: 0, completedRequests: 0, totalAssignments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const acceptedRequests = Math.max(0, stats.totalRequests - stats.pendingRequests - stats.completedRequests);
  const completedAssignments = stats.completedAssignments ?? 0;
  const activeAssignments = Math.max(0, stats.totalAssignments - completedAssignments);

  const userRoleData = [
    { name: 'Volunteers', value: stats.totalVolunteers },
    { name: 'Citizens', value: stats.totalCitizens },
    { name: 'Admins', value: Math.max(0, stats.totalUsers - stats.totalVolunteers - stats.totalCitizens) },
  ].filter((d) => d.value > 0);

  const requestStatusData = [
    { name: 'Pending', value: stats.pendingRequests },
    { name: 'Accepted', value: acceptedRequests },
    { name: 'Completed', value: stats.completedRequests },
  ].filter((d) => d.value > 0);

  const overviewBarData = [
    { name: 'Users',       Total: stats.totalUsers,       Active: stats.totalVolunteers + stats.totalCitizens },
    { name: 'Requests',    Total: stats.totalRequests,    Active: stats.pendingRequests + acceptedRequests },
    { name: 'Assignments', Total: stats.totalAssignments, Active: activeAssignments },
  ];

  // Simulated trend data for area chart
  const trendData = [
    { name: 'W1', Requests: Math.max(0, stats.totalRequests - 12), Assignments: Math.max(0, stats.totalAssignments - 8) },
    { name: 'W2', Requests: Math.max(0, stats.totalRequests - 8),  Assignments: Math.max(0, stats.totalAssignments - 5) },
    { name: 'W3', Requests: Math.max(0, stats.totalRequests - 4),  Assignments: Math.max(0, stats.totalAssignments - 3) },
    { name: 'Now', Requests: stats.totalRequests,                   Assignments: stats.totalAssignments },
  ];

  const completionRate = stats.totalRequests > 0
    ? Math.round((stats.completedRequests / stats.totalRequests) * 100) : 0;

  const tooltipStyle = {
    borderRadius: '8px',
    border: isDark ? '1px solid #444444' : '1px solid #dddddd',
    backgroundColor: isDark ? '#000000' : '#ffffff',
    color: isDark ? '#f5f5f5' : '#111111',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 12px',
    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.8)' : '0 4px 16px rgba(0,0,0,0.1)',
  };
  const tooltipCursor = { fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' };
  const gridColor  = isDark ? '#2a2a2a' : '#f0f0f0';
  const axisColor  = isDark ? '#888888' : '#999999';
  const legendStyle = { fontSize: '12px' };
  const legendFormatter = (value: string) => (
    <span style={{ color: isDark ? '#cccccc' : '#555555' }}>{value}</span>
  );

  const healthItems = [
    {
      label: t('admin_request_completion'),
      value: completionRate,
      icon: CircleCheck,
      color: 'text-[#059669]',
      bar: 'bg-[#10b981]',
      bg: 'bg-[#f0fdf4] dark:bg-[#14532d]/20',
      border: 'border-[#bbf7d0] dark:border-[#059669]/30',
    },
    {
      label: t('admin_volunteer_ratio'),
      value: stats.totalUsers > 0 ? Math.round((stats.totalVolunteers / stats.totalUsers) * 100) : 0,
      icon: UserCheck,
      color: 'text-[#2563eb]',
      bar: 'bg-[#3b82f6]',
      bg: 'bg-[#eff6ff] dark:bg-[#1e3a5f]/20',
      border: 'border-[#bfdbfe] dark:border-[#2563eb]/30',
    },
    {
      label: t('admin_active_assignments'),
      value: stats.totalAssignments > 0 ? Math.round((activeAssignments / stats.totalAssignments) * 100) : 0,
      icon: Activity,
      color: 'text-[#7c3aed]',
      bar: 'bg-[#8b5cf6]',
      bg: 'bg-[#faf5ff] dark:bg-[#2e1065]/20',
      border: 'border-[#e9d5ff] dark:border-[#7c3aed]/30',
    },
    {
      label: t('admin_pending_rate'),
      value: stats.totalRequests > 0 ? Math.round((stats.pendingRequests / stats.totalRequests) * 100) : 0,
      icon: AlertCircle,
      color: 'text-[#d97706]',
      bar: 'bg-[#f59e0b]',
      bg: 'bg-[#fffbeb] dark:bg-[#451a03]/20',
      border: 'border-[#fde68a] dark:border-[#d97706]/30',
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" text={t('common_loading')} />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white shadow-soft-lg">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-green-500/5 rounded-full filter blur-2xl pointer-events-none" />
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 opacity-[0.04]" />

        <div className="relative p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary-400" />
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{t('admin_system_administration')}</p>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold mb-1 leading-tight">
              {t('admin_dashboard_title')}
            </h1>
            <p className="text-slate-400 text-sm mb-5">{t('admin_full_system_overview')}</p>

            {/* Key metrics inline */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: t('admin_total_users'),    val: stats.totalUsers,       color: 'text-primary-400',   bg: 'bg-primary-500/10' },
                { label: t('admin_total_requests'), val: stats.totalRequests,    color: 'text-secondary-400', bg: 'bg-secondary-500/10' },
                { label: t('admin_assignments_label'),    val: stats.totalAssignments, color: 'text-green-400',     bg: 'bg-green-500/10' },
                { label: t('admin_completion'),     val: `${completionRate}%`,   color: 'text-yellow-400',    bg: 'bg-yellow-500/10' },
              ].map((m) => (
                <div key={m.label} className={`${m.bg} rounded-xl px-4 py-2.5 text-center border border-white/5`}>
                  <p className={`font-display text-xl font-black ${m.color}`}>{m.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0 flex-wrap">
            <Button
              type="button"
              variant="export"
              icon={Download}
              onClick={() => exportToCSV([{
                'Total Users': stats.totalUsers,
                Volunteers: stats.totalVolunteers,
                Citizens: stats.totalCitizens,
                'Total Requests': stats.totalRequests,
                'Pending Requests': stats.pendingRequests,
                'Completed Requests': stats.completedRequests,
                'Total Assignments': stats.totalAssignments,
                'Completion Rate': `${completionRate}%`,
              }], 'admin_summary')}
            >
              Export
            </Button>
            <Link to="/admin/analytics">
              <Button variant="analytics" icon={TrendingUp}>
                Analytics
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button className="bg-primary-600 hover:bg-primary-700" icon={Settings}>
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Primary Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t('admin_total_users')}    value={stats.totalUsers}      icon={Users}      color="blue"   link="/admin/users" />
        <StatCard title={t('admin_volunteers')}     value={stats.totalVolunteers} icon={Award}      color="green"  link="/admin/users?role=VOLUNTEER" />
        <StatCard title={t('admin_citizens')}       value={stats.totalCitizens}   icon={Users}      color="purple" link="/admin/users?role=CITIZEN" />
        <StatCard title={t('admin_total_requests')} value={stats.totalRequests}   icon={FileText}   color="orange" link="/admin/requests" />
      </div>

      {/* ── Secondary Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title={t('admin_pending_requests')}   value={stats.pendingRequests}   icon={Clock}       color="yellow" link="/admin/requests?status=PENDING" />
        <StatCard title={t('admin_completed_requests')} value={stats.completedRequests} icon={CheckSquare} color="green"  link="/admin/requests?status=COMPLETED" />
        <StatCard title={t('admin_total_assignments')}  value={stats.totalAssignments}  icon={CheckSquare} color="indigo" link="/admin/assignments" />
      </div>

      {/* ── System Health ────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm p-5 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest">{t('admin_system_health')}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mt-0.5">{t('admin_platform_performance')}</p>
          </div>
          <Activity className="w-5 h-5 text-[#10b981]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {healthItems.map((item) => (
            <div key={item.label} className={`${item.bg} border ${item.border} rounded-xl p-4 transition-colors duration-200`}>
              <div className="flex items-center justify-between mb-3">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className={`text-2xl font-display font-black ${item.color}`}>{item.value}%</span>
              </div>
              <div className="h-1.5 bg-white/60 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
                <ProgressBar pct={item.value} colorClass={item.bar} />
              </div>
              <span className={`text-xs font-semibold ${item.color} leading-tight block`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{t('admin_user_distribution')}</h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400">{t('admin_breakdown_by_role')}</p>
            </div>
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          {userRoleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={52} outerRadius={84} paddingAngle={4} dataKey="value" labelLine={false} label={renderCustomLabel}>
                  {userRoleData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS_USERS[index % PIE_COLORS_USERS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [value, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} formatter={legendFormatter} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[210px] flex items-center justify-center text-neutral-500 dark:text-slate-400 text-sm">No user data yet</div>
          )}
        </Card>

        {/* Request Status */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{t('admin_request_status')}</h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400">{t('admin_current_distribution')}</p>
            </div>
            <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          {requestStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={requestStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={84} paddingAngle={4} dataKey="value" labelLine={false} label={renderCustomLabel}>
                  {requestStatusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS_REQUESTS[index % PIE_COLORS_REQUESTS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [value, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} formatter={legendFormatter} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[210px] flex items-center justify-center text-neutral-500 dark:text-slate-400 text-sm">No request data yet</div>
          )}
        </Card>

        {/* System Overview Bar */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{t('admin_system_overview')}</h3>
              <p className="text-xs text-neutral-500 dark:text-slate-400">{t('admin_total_vs_active')}</p>
            </div>
            <div className="w-8 h-8 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={overviewBarData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={tooltipCursor} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} formatter={legendFormatter} />
              <Bar dataKey="Total" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Active" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Growth Trend ─────────────────────────────────────────────── */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">{t('admin_platform_growth')}</h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400">{t('admin_cumulative_requests')}</p>
          </div>
          <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="asgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={tooltipCursor} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} formatter={legendFormatter} />
            <Area type="monotone" dataKey="Requests" stroke="#0d9488" strokeWidth={2} fill="url(#reqGrad)" />
            <Area type="monotone" dataKey="Assignments" stroke="#6366f1" strokeWidth={2} fill="url(#asgGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Alerts ───────────────────────────────────────────────────── */}
      {(stats.pendingRequests > 5 || activeAssignments < stats.pendingRequests) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.pendingRequests > 5 && (
            <Link
              to="/admin/requests?status=PENDING"
              className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-xl p-4 hover:border-gray-500 dark:hover:border-white/30 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                  {stats.pendingRequests} Requests Awaiting Volunteers
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Review and assign volunteers →</p>
              </div>
            </Link>
          )}
          {activeAssignments < stats.pendingRequests && (
            <Link
              to="/admin/users?role=VOLUNTEER"
              className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 hover:border-gray-400 dark:hover:border-white/25 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-gray-700 dark:bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-white dark:text-gray-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:translate-x-0.5 transition-transform">
                  More Volunteers Needed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pending requests exceed active assignments →</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          title={t('admin_user_management')}
          headerClassName="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent"
          headerRight={
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          }
        >
          <div className="space-y-2">
            {[
              { to: '/admin/users',                label: t('admin_view_all_users'),       desc: `${stats.totalUsers} ${t('admin_registered_users')}` },
              { to: '/admin/users?role=VOLUNTEER', label: t('admin_volunteer_management'), desc: `${stats.totalVolunteers} ${t('admin_volunteers').toLowerCase()}` },
              { to: '/admin/users?role=CITIZEN',   label: t('admin_citizen_management'),   desc: `${stats.totalCitizens} ${t('admin_citizens').toLowerCase()}` },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all duration-200 group"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-blue-400" />
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={t('admin_request_management')}
          headerClassName="bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10 dark:to-transparent"
          headerRight={
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          }
        >
          <div className="space-y-2">
            {[
              { to: '/admin/requests',                label: t('admin_all_requests'),    desc: `${stats.totalRequests} ${t('admin_total_label')}` },
              { to: '/admin/requests?status=PENDING', label: t('admin_pending_requests'), desc: `${stats.pendingRequests} ${t('admin_awaiting_volunteers')}` },
              { to: '/admin/assignments',             label: t('admin_all_assignments'),  desc: `${stats.totalAssignments} ${t('admin_assignments_label').toLowerCase()}` },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-sm transition-all duration-200 group"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-orange-700 dark:group-hover:text-orange-400 group-hover:translate-x-0.5 transition-transform duration-200">{item.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-orange-400" />
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={t('nav_system_settings')}
          headerClassName="bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/10 dark:to-transparent"
          headerRight={
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          }
        >
          <div className="space-y-2">
            {[
              { to: '/admin/skills',    icon: Zap,       label: t('admin_skill_management'),    desc: t('admin_manage_skill_categories'), color: 'text-purple-600 dark:text-purple-400',  hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600', hoverText: 'group-hover:text-purple-700 dark:group-hover:text-purple-400' },
              { to: '/admin/locations', icon: MapPin,    label: 'Location Management', desc: 'Manage geographic data',             color: 'text-green-600 dark:text-green-400',    hoverBorder: 'hover:border-green-300 dark:hover:border-green-600',   hoverText: 'group-hover:text-green-700 dark:group-hover:text-green-400' },
              { to: '/admin/analytics', icon: BarChart3, label: 'Analytics & Reports', desc: 'Full system analytics',              color: 'text-primary-600 dark:text-primary-400', hoverBorder: 'hover:border-primary-300 dark:hover:border-primary-600', hoverText: 'group-hover:text-primary-700 dark:group-hover:text-primary-400' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 dark:border-slate-700 ${item.hoverBorder} hover:shadow-sm transition-all duration-200 group`}
              >
                <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-gray-900 dark:text-slate-100 ${item.hoverText} group-hover:translate-x-0.5 transition-transform duration-200`}>{item.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-neutral-500" />
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
