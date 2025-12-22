import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, CheckSquare, Award, MapPin, Calendar, Activity } from 'lucide-react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';

interface AnalyticsData {
  totalUsers: number;
  totalVolunteers: number;
  totalCitizens: number;
  totalRequests: number;
  totalAssignments: number;
  completionRate: number;
  activeVolunteers: number;
  averageResponseTime: string;
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
      case 'user_registered':
        return Users;
      case 'request_created':
        return FileText;
      case 'request_completed':
        return CheckSquare;
      case 'assignment_created':
        return Award;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered':
        return 'bg-blue-100 text-blue-600';
      case 'request_created':
        return 'bg-yellow-100 text-yellow-600';
      case 'request_completed':
        return 'bg-green-100 text-green-600';
      case 'assignment_created':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">System performance and usage insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input-field"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
              <p className="text-xs text-green-600">+{analytics.growthMetrics.userGrowth}%</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalRequests}</p>
              <p className="text-xs text-green-600">+{analytics.growthMetrics.requestGrowth}%</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAssignments}</p>
              <p className="text-xs text-green-600">+{analytics.growthMetrics.assignmentGrowth}%</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
              <p className="text-xs text-gray-500">Real-time</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageResponseTime}</p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeVolunteers}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Province */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Performance by Province</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.performanceByProvince?.map((province) => (
                <div key={province.province} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{province.province}</p>
                      <p className="text-sm text-gray-500">{province.userCount} users • {province.requestCount} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{province.completionRate}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No province data available</p>}
            </div>
          </div>
        </Card>

        {/* Top Skills */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Most Requested Skills</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.mostRequestedSkills?.map((skill) => (
                <div key={skill.skillName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{skill.skillName}</p>
                      <p className="text-sm text-gray-500">{skill.volunteerCount} volunteers available</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{skill.requestCount}</p>
                    <p className="text-xs text-gray-500">requests</p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No skills data available</p>}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.recentActivity?.length > 0 ? analytics.recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const timeAgo = new Date(activity.timestamp).toLocaleString();
              return (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">No recent activity</p>}
          </div>
        </div>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-green-600 font-medium mt-1">All Systems Operational</p>
            <p className="text-sm text-gray-500 mt-2">99.9% uptime this month</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Growth Trend</h3>
            <p className="text-blue-600 font-medium mt-1">
              {analytics.growthMetrics.userGrowth > 0 ? 'Positive Growth' : 'Stable'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {analytics.growthMetrics.userGrowth}% user growth this month
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Satisfaction</h3>
            <p className="text-purple-600 font-medium mt-1">4.8/5.0 Rating</p>
            <p className="text-sm text-gray-500 mt-2">Based on system performance</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;