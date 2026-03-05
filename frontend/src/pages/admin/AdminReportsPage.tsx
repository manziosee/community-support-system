import React, { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, Users, Clock, Star, Download,
  CheckCircle, XCircle, AlertTriangle, Activity,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import Breadcrumb from '../../components/common/Breadcrumb';
import StatCard from '../../components/common/StatCard';
import SectionCard from '../../components/dashboard/SectionCard';
import { exportToCSV } from '../../utils/exportUtils';

const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

// ─── Mock analytics data ──────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: 'Sep', requests: 34, completions: 28 },
  { month: 'Oct', requests: 52, completions: 41 },
  { month: 'Nov', requests: 61, completions: 53 },
  { month: 'Dec', requests: 48, completions: 38 },
  { month: 'Jan', requests: 73, completions: 62 },
  { month: 'Feb', requests: 89, completions: 77 },
  { month: 'Mar', requests: 104, completions: 91 },
];

const CATEGORY_DATA = [
  { category: 'General Help',     count: 82 },
  { category: 'Transportation',   count: 67 },
  { category: 'Tech Support',     count: 43 },
  { category: 'Shopping',         count: 58 },
  { category: 'Tutoring',         count: 31 },
  { category: 'Household',        count: 49 },
  { category: 'Healthcare',       count: 25 },
  { category: 'Other',            count: 17 },
];

const PROVINCE_DATA = [
  { province: 'Kigali',   count: 156 },
  { province: 'Northern', count: 78 },
  { province: 'Southern', count: 67 },
  { province: 'Eastern',  count: 54 },
  { province: 'Western',  count: 45 },
];

const PEAK_HOURS = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  label: h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`,
  count: Math.round(Math.sin(((h - 8) * Math.PI) / 12) * 20 + 22 + Math.random() * 5),
}));

const VOLUNTEER_RETENTION = [
  { month: 'Sep', rate: 72 },
  { month: 'Oct', rate: 75 },
  { month: 'Nov', rate: 79 },
  { month: 'Dec', rate: 76 },
  { month: 'Jan', rate: 82 },
  { month: 'Feb', rate: 85 },
  { month: 'Mar', rate: 88 },
];

const AdminReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats({
        totalUsers: 342, totalVolunteers: 128, totalCitizens: 210,
        totalRequests: 461, pendingRequests: 34, completedRequests: 390, totalAssignments: 427,
      }))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    exportToCSV(MONTHLY_DATA, 'community-support-reports');
  };

  const kpiCards = [
    { title: 'Avg Response Time', value: '2.4h',   icon: Clock,        color: 'blue'   as const, subtitle: '↓ 18% vs last month' },
    { title: 'Completion Rate',   value: '87.5%',  icon: CheckCircle,  color: 'green'  as const, subtitle: '↑ 3.2% vs last month' },
    { title: 'NPS Score',         value: '72',     icon: Star,         color: 'yellow' as const, subtitle: 'Excellent' },
    { title: 'Volunteer Burnout', value: 'Low',    icon: AlertTriangle,color: 'orange' as const, subtitle: '3 at-risk volunteers' },
    { title: 'Active Users',      value: stats?.totalUsers ?? '—', icon: Users, color: 'purple' as const, subtitle: 'All time' },
    { title: 'Satisfaction',      value: '4.8/5',  icon: Star,         color: 'red'    as const, subtitle: 'Avg rating' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumb />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-600 to-primary-700 text-white shadow-soft-lg p-6">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-5 h-5" />
              <h1 className="font-display text-xl font-extrabold">Advanced Reports & Analytics</h1>
            </div>
            <p className="text-white/70 text-sm">Deep insights into community support operations.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Period Toggle */}
            <div className="flex gap-1 bg-white/10 rounded-xl p-1">
              {(['week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${period === p ? 'bg-white text-slate-800' : 'text-white/70 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20"
            >
              <Download className="w-4 h-4" />Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-neutral-200 dark:bg-slate-700 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((card) => (
            <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} color={card.color} subtitle={card.subtitle} />
          ))}
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <SectionCard title="Monthly Growth Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="requests"    stroke="#0d9488" strokeWidth={2.5} dot={false} name="Requests" />
              <Line type="monotone" dataKey="completions" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Completions" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Volunteer Retention */}
        <SectionCard title="Volunteer Retention Rate (%)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VOLUNTEER_RETENTION} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 12 }} formatter={(v) => [`${v}%`, 'Retention Rate']} />
              <Bar dataKey="rate" fill="#0d9488" radius={[6, 6, 0, 0]} name="Retention" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-2">
          <SectionCard title="Requests by Category">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CATEGORY_DATA} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={60} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Requests">
                  {CATEGORY_DATA.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Geographic Coverage */}
        <SectionCard title="Geographic Coverage">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PROVINCE_DATA} dataKey="count" nameKey="province" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3} label={(entry: any) => `${entry.province} ${((entry.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {PROVINCE_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Peak Usage Times */}
      <SectionCard title="Peak Usage Hours (Requests per Hour)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={PEAK_HOURS} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 12 }} formatter={(v) => [v, 'Requests']} labelFormatter={(l) => `Hour: ${l}`} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {PEAK_HOURS.map((entry, index) => (
                <Cell key={index} fill={entry.hour >= 8 && entry.hour <= 18 ? '#0d9488' : '#6366f1'} opacity={0.7 + (entry.count / 50) * 0.3} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-500 inline-block" /><span className="text-xs text-neutral-500 dark:text-slate-400">Business hours</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-secondary-500 inline-block" /><span className="text-xs text-neutral-500 dark:text-slate-400">Off-peak hours</span></div>
        </div>
      </SectionCard>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Avg Request → Assignment', value: '3.2 hrs',  icon: Clock,        color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { title: 'Geographic Coverage',       value: '5 / 5',   icon: Activity,     color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/20' },
          { title: 'Volunteer Burnout Risk',    value: '3 users',  icon: AlertTriangle,color: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { title: 'Demand Forecast (next wk)', value: '+12%',    icon: TrendingUp,   color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((insight) => (
          <div key={insight.title} className={`${insight.bg} rounded-xl p-4 border border-white/50 dark:border-white/5`}>
            <insight.icon className={`w-5 h-5 ${insight.color} mb-2`} />
            <p className={`text-2xl font-display font-black ${insight.color}`}>{insight.value}</p>
            <p className="text-xs text-neutral-600 dark:text-slate-400 mt-1 leading-snug">{insight.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReportsPage;
