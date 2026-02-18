import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckSquare, 
  Clock, 
  Award, 
  Bell, 
  MapPin,
  Plus,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi, requestsApi, notificationsApi, analyticsApi } from '../../services/api';
import type { Assignment, Request, Notification } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VolunteerDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableRequests, setAvailableRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    availableRequests: 0,
    unreadNotifications: 0,
  });
  const [chartData, setChartData] = useState<Array<{ status: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh user data once on mount to ensure skills are loaded
  useEffect(() => {
    if (user?.userId) {
      refreshUser();
    }
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const [assignmentsResponse, requestsResponse, notificationsResponse, unreadCountResponse, statsResponse] = await Promise.all([
          assignmentsApi.getByVolunteer(user.userId),
          requestsApi.getPending(),
          notificationsApi.getByUser(user.userId),
          notificationsApi.getUnreadCount(user.userId),
          analyticsApi.getVolunteerStats(user.userId),
        ]);

        const userAssignments = assignmentsResponse.data;
        const pendingRequests = requestsResponse.data;
        
        setAssignments(userAssignments.slice(0, 5));
        setAvailableRequests(pendingRequests.slice(0, 5));
        setNotifications(notificationsResponse.data.slice(0, 5));

        const analyticsData = statsResponse.data;
        setStats({
          totalAssignments: analyticsData.totalAssignments || userAssignments.length,
          activeAssignments: analyticsData.activeAssignments || userAssignments.filter((a: Assignment) => !a.completedAt).length,
          completedAssignments: analyticsData.completedAssignments || userAssignments.filter((a: Assignment) => a.completedAt).length,
          availableRequests: pendingRequests.length,
          unreadNotifications: unreadCountResponse.data,
        });

        setChartData(analyticsData.statusBreakdown || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({
          totalAssignments: 0,
          activeAssignments: 0,
          completedAssignments: 0,
          availableRequests: 0,
          unreadNotifications: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading volunteer dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl lg:rounded-2xl shadow-soft-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 🤝
            </h1>
            <p className="text-white/90 flex items-center mb-2 text-sm sm:text-base">
              <MapPin className="inline w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user?.district || user?.location?.district}, {user?.province || user?.location?.province}</span>
            </p>
            <div className="flex items-start">
              <Award className="w-4 h-4 text-white/80 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-white/90 break-words">
                Skills: {user?.skills?.map(s => s.skillName).join(', ') || 'No skills added'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <Link to="/requests/available" className="flex-1 lg:flex-none">
              <button className="w-full inline-flex items-center justify-center bg-white text-sky-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md font-semibold text-sm sm:text-base">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Browse Requests</span>
                <span className="sm:hidden">Browse</span>
              </button>
            </Link>
            <Link to="/profile" className="flex-1 lg:flex-none">
              <button className="w-full inline-flex items-center justify-center bg-white text-sky-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md font-semibold text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Update Skills</span>
                <span className="sm:hidden">Skills</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon={CheckSquare}
          color="blue"
          link="/assignments"
        />
        <StatCard
          title="Active"
          value={stats.activeAssignments}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Completed"
          value={stats.completedAssignments}
          icon={Award}
          color="green"
        />
        <StatCard
          title="Available Requests"
          value={stats.availableRequests}
          icon={FileText}
          color="purple"
          link="/requests/available"
        />
        <StatCard
          title="Notifications"
          value={stats.unreadNotifications}
          icon={Bell}
          color="red"
          link="/notifications"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Assignment Status Chart */}
        {chartData.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
                Assignment Status Overview
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {chartData.map((entry, index) => {
                    const colors = {
                      'Active': '#f59e0b',
                      'Completed': '#10b981',
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.status as keyof typeof colors] || '#6b7280'} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* My Active Assignments */}
        <Card padding="none" hover>
          <div className="p-6 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">My Active Assignments</h2>
              <Link to="/assignments" className="text-sm text-sky-600 hover:text-sky-700 font-semibold">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {assignments.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No active assignments"
                description="Browse available requests to start helping your community"
                actionLabel="Browse Requests"
                onAction={() => window.location.href = '/requests/available'}
              />
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <Link
                    key={assignment.assignmentId}
                    to={`/assignments/${assignment.assignmentId}`}
                    className="block p-4 border border-sky-200 rounded-lg hover:bg-sky-50 hover:border-sky-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {assignment.request?.title || 'Assignment'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Accepted: {new Date(assignment.acceptedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={assignment.completedAt ? 'success' : 'warning'}>
                        {assignment.completedAt ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Available Requests */}
        <Card padding="none" hover>
          <div className="p-6 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Available Requests</h2>
              <Link to="/requests/available" className="text-sm text-sky-600 hover:text-sky-700 font-semibold">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {availableRequests.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No available requests"
                description="Check back later for new requests from citizens"
              />
            ) : (
              <div className="space-y-3">
                {availableRequests.map((request) => (
                  <Link
                    key={request.requestId}
                    to={`/requests/${request.requestId}`}
                    className="block p-4 border border-sky-200 rounded-lg hover:bg-sky-50 hover:border-sky-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{request.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.citizen.location ? 
                            `${request.citizen.location.district}, ${request.citizen.location.province}` :
                            `${request.citizen.district || 'N/A'}, ${request.citizen.province || 'N/A'}`
                          }
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Posted: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="warning">
                        {request.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card padding="none" hover>
        <div className="p-6 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-sky-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
            <Link to="/notifications" className="text-sm text-sky-600 hover:text-sky-700 font-semibold">
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="You'll see notifications here when there are updates"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    notification.isRead
                      ? 'border-neutral-200 bg-white'
                      : 'border-sky-200 bg-sky-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-900 flex-1">{notification.message}</p>
                    {!notification.isRead && (
                      <span className="ml-2 w-2 h-2 bg-sky-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card hover className="group">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">Browse Requests</h3>
            <p className="text-gray-600 mt-2 text-sm">Find new requests that match your skills</p>
            <Link to="/requests/available" className="mt-4 inline-block">
              <Button size="sm">Browse Now</Button>
            </Link>
          </div>
        </Card>

        <Card hover className="group">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">My Assignments</h3>
            <p className="text-gray-600 mt-2 text-sm">Track your ongoing and completed work</p>
            <Link to="/assignments" className="mt-4 inline-block">
              <Button size="sm" variant="secondary">View Assignments</Button>
            </Link>
          </div>
        </Card>

        <Card hover className="group">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">My Skills</h3>
            <p className="text-gray-600 mt-2 text-sm">Update your skills and expertise</p>
            <Link to="/profile" className="mt-4 inline-block">
              <Button size="sm" variant="secondary">Manage Skills</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerDashboard;