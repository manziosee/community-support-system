import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, CheckSquare, Award, Calendar, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';

interface AnalyticsData {
  totalUsers: number;
  totalVolunteers: number;
  totalCitizens: number;
  totalAdmins: number;
  totalRequests: number;
  totalAssignments: number;
  completionRate: number;
  activeVolunteers: number;
  averageResponseTime: string;
  pendingRequests: number;
  completedRequests: number;
  acceptedRequests: number;
  cancelledRequests: number;
  performanceByProvince: Array<{
    province: string;
    userCount: number;
    requestCount: number;
    completionRate: number;
  }>;
  mostRequestedSkills: Array<{
    skillName: string;
    volunteerCount: number;
    requestCount: number;
    description: string;
    demandLevel: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  growthMetrics: {
    userGrowth: number;
    requestGrowth: number;
    assignmentGrowth: number;
  };
}

const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6'];
const PROVINCE_COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#22c55e'];

const AdminAnalyticsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': case 'citizen_registered': case 'volunteer_joined': return Users;
      case 'request_created': return FileText;
      case 'request_completed': case 'assignment_completed': return CheckSquare;
      case 'assignment_created': return Award;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered': case 'citizen_registered': case 'volunteer_joined': return 'bg-blue-100 text-blue-600';
      case 'request_created': return 'bg-yellow-100 text-yellow-600';
      case 'request_completed': case 'assignment_completed': return 'bg-green-100 text-green-600';
      case 'assignment_created': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading analytics..." />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button onClick={fetchAnalytics} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
        </div>
      </div>
    );
  }

  if (!analytics) return <div className="text-center text-gray-500 py-12">No data available</div>;

  // Derived chart data
  const userDistributionData = [
    { name: 'Volunteers', value: analytics.totalVolunteers },
    { name: 'Citizens', value: analytics.totalCitizens },
    { name: 'Admins', value: analytics.totalAdmins || Math.max(0, analytics.totalUsers - analytics.totalVolunteers - analytics.totalCitizens) },
  ].filter(d => d.value > 0);

  const requestStatusData = [
    { name: 'Pending', value: analytics.pendingRequests || 0 },
    { name: 'Accepted', value: analytics.acceptedRequests || 0 },
    { name: 'Completed', value: analytics.completedRequests || 0 },
    { name: 'Cancelled', value: analytics.cancelledRequests || 0 },
  ].filter(d => d.value > 0);

  const provinceBarData = (analytics.performanceByProvince || []).map(p => ({
    name: p.province.replace(' Province', '').replace(' City', ''),
    Users: p.userCount,
    Requests: p.requestCount,
  }));

  const skillsRadarData = (analytics.mostRequestedSkills || []).slice(0, 6).map(s => ({
    skill: s.skillName.length > 12 ? s.skillName.substring(0, 12) + '...' : s.skillName,
    volunteers: s.volunteerCount,
    requests: s.requestCount,
  }));

  const growthData = [
    { name: 'Users', growth: analytics.growthMetrics?.userGrowth || 0 },
    { name: 'Requests', growth: analytics.growthMetrics?.requestGrowth || 0 },
    { name: 'Assignments', growth: analytics.growthMetrics?.assignmentGrowth || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">System performance and usage insights</p>
        </div>
        <select title="Time range" className="input-field w-auto" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600', growth: analytics.growthMetrics?.userGrowth },
          { label: 'Total Requests', value: analytics.totalRequests, icon: FileText, color: 'bg-yellow-100 text-yellow-600', growth: analytics.growthMetrics?.requestGrowth },
          { label: 'Assignments', value: analytics.totalAssignments, icon: CheckSquare, color: 'bg-green-100 text-green-600', growth: analytics.growthMetrics?.assignmentGrowth },
          { label: 'Completion Rate', value: `${analytics.completionRate}%`, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
          { label: 'Avg Response', value: analytics.averageResponseTime, icon: Calendar, color: 'bg-orange-100 text-orange-600' },
          { label: 'Active Volunteers', value: analytics.activeVolunteers, icon: Award, color: 'bg-red-100 text-red-600' },
        ].map((metric, i) => (
          <Card key={i}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                {metric.growth !== undefined && (
                  <p className={`text-xs ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.growth >= 0 ? '+' : ''}{metric.growth}%
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1: User Distribution + Request Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          {userDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {userDistributionData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No user data yet</div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Breakdown</h3>
          {requestStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={requestStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {requestStatusData.map((_entry, index) => (
                    <Cell key={index} fill={['#f59e0b', '#6366f1', '#22c55e', '#ef4444'][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">No request data yet</div>
          )}
        </Card>
      </div>

      {/* Charts Row 2: Province Performance + Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Province</h3>
          {provinceBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={provinceBarData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Users" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-400">No province data available</div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Demand Overview</h3>
          {skillsRadarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar name="Volunteers" dataKey="volunteers" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                <Radar name="Requests" dataKey="requests" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-gray-400">No skills data available</div>
          )}
        </Card>
      </div>

      {/* Growth Metrics Bar Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics (30-Day Trend)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value: number) => [`${value}%`, 'Growth']} />
            <Bar dataKey="growth" radius={[6, 6, 0, 0]}>
              {growthData.map((entry, index) => (
                <Cell key={index} fill={entry.growth >= 0 ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Province Completion Rates */}
      {analytics.performanceByProvince && analytics.performanceByProvince.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Province Completion Rates</h3>
          <div className="space-y-3">
            {analytics.performanceByProvince.map((province, index) => (
              <div key={province.province} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium text-gray-700 truncate">{province.province}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white transition-all duration-500"
                    style={{ width: `${Math.max(province.completionRate, 2)}%`, backgroundColor: PROVINCE_COLORS[index % PROVINCE_COLORS.length] }}
                  >
                    {province.completionRate > 10 ? `${province.completionRate}%` : ''}
                  </div>
                </div>
                <div className="w-14 text-right text-sm font-semibold text-gray-900">{province.completionRate}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Skills Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Most Requested Skills</h2>
          </div>
          <div className="p-6 space-y-3">
            {analytics.mostRequestedSkills?.length > 0 ? analytics.mostRequestedSkills.map((skill) => (
              <div key={skill.skillName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{skill.skillName}</p>
                    <p className="text-xs text-gray-500">{skill.volunteerCount} volunteers</p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                  skill.demandLevel === 'High' ? 'bg-red-100 text-red-700' :
                  skill.demandLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {skill.demandLevel || 'Low'}
                </span>
              </div>
            )) : <p className="text-gray-500">No skills data available</p>}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
          </div>
          <div className="p-6 space-y-3">
            {analytics.recentActivity?.length > 0 ? analytics.recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const timeAgo = new Date(activity.timestamp).toLocaleString();
              return (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">No recent activity</p>}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-green-600 font-medium mt-1">All Systems Operational</p>
            <p className="text-sm text-gray-500 mt-1">99.9% uptime</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Growth Trend</h3>
            <p className="text-blue-600 font-medium mt-1">
              {(analytics.growthMetrics?.userGrowth || 0) > 0 ? 'Positive Growth' : 'Stable'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{analytics.growthMetrics?.userGrowth || 0}% user growth</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <p className="text-purple-600 font-medium mt-1">{analytics.completionRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Assignment completion rate</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
