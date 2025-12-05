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
import { useAuth } from '../../contexts/AuthContext';
import { assignmentsApi, requestsApi, notificationsApi } from '../../services/api';
import type { Assignment, Request, Notification } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
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
  const [isLoading, setIsLoading] = useState(true);

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

        setStats({
          totalAssignments: userAssignments.length,
          activeAssignments: userAssignments.filter((a: Assignment) => !a.completedAt).length,
          completedAssignments: userAssignments.filter((a: Assignment) => a.completedAt).length,
          availableRequests: pendingRequests.length,
          unreadNotifications: unreadCountResponse.data,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Mock data for demo
        setStats({
          totalAssignments: 12,
          activeAssignments: 3,
          completedAssignments: 9,
          availableRequests: 8,
          unreadNotifications: 2,
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}! 🤝
            </h1>
            <p className="text-gray-600 mt-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              {user?.location.district}, {user?.location.province}
            </p>
            <div className="flex items-center mt-2">
              <Award className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">
                Skills: {user?.skills?.map(s => s.skillName).join(', ') || 'No skills added'}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to="/requests/available">
              <Button variant="secondary" icon={FileText}>
                Browse Requests
              </Button>
            </Link>
            <Link to="/profile">
              <Button icon={Plus}>
                Update Skills
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Active Assignments */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Active Assignments</h2>
              <Link to="/assignments" className="text-sm text-blue-600 hover:text-blue-500">
                View all
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
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
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
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Available Requests</h2>
              <Link to="/requests/available" className="text-sm text-blue-600 hover:text-blue-500">
                View all
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
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{request.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.citizen.location.district}, {request.citizen.location.province}
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
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-500">
              View all
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
                  className={`p-4 border rounded-lg transition-all ${
                    notification.isRead
                      ? 'border-gray-200 bg-white'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-900 flex-1">{notification.message}</p>
                    {!notification.isRead && (
                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">Browse Requests</h3>
            <p className="text-gray-600 mt-2 text-sm">Find new requests that match your skills</p>
            <Link to="/requests/available" className="mt-4 inline-block">
              <Button size="sm">Browse Now</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">My Assignments</h3>
            <p className="text-gray-600 mt-2 text-sm">Track your ongoing and completed work</p>
            <Link to="/assignments" className="mt-4 inline-block">
              <Button size="sm" variant="secondary">View Assignments</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-yellow-600" />
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