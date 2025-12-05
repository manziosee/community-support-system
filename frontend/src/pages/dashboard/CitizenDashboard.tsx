import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, Plus, Bell, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi, notificationsApi } from '../../services/api';
import type { Request, Notification } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    unreadNotifications: 0,
  });
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
        setRequests(userRequests.slice(0, 5)); // Show latest 5 requests
        setNotifications(notificationsResponse.data.slice(0, 5)); // Show latest 5 notifications

        setStats({
          totalRequests: userRequests.length,
          pendingRequests: userRequests.filter((r: Request) => r.status === 'PENDING').length,
          completedRequests: userRequests.filter((r: Request) => r.status === 'COMPLETED').length,
          unreadNotifications: unreadCountResponse.data,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              {user?.location.district}, {user?.location.province}
            </p>
          </div>
          <Link to="/requests/create">
            <Button icon={Plus}>
              Create Request
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FileText}
          color="blue"
          link="/requests"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={stats.completedRequests}
          icon={CheckCircle}
          color="green"
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
        {/* Recent Requests */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <Link to="/requests" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {requests.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No requests yet"
                description="Create your first request to get help from volunteers"
                actionLabel="Create Request"
                onAction={() => window.location.href = '/requests/create'}
              />
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <Link
                    key={request.requestId}
                    to={`/requests/${request.requestId}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{request.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

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
              <div className="space-y-3">
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
      </div>
    </div>
  );
};

export default CitizenDashboard;