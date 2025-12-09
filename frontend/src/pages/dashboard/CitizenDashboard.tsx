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
      <div className="bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl shadow-soft-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90 flex items-center">
              <MapPin className="inline w-4 h-4 mr-1" />
              {user?.location.district}, {user?.location.province}
            </p>
          </div>
          <Link to="/requests/create">
            <button className="inline-flex items-center bg-white text-sky-600 px-6 py-3 rounded-lg shadow-md font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Create Request
            </button>
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
        <Card padding="none" hover>
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
              <Link to="/requests" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                View all →
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
                    className="block p-4 border border-neutral-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 hover:shadow-sm transition-all duration-200"
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
        <Card padding="none" hover>
          <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-accent-50 to-primary-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
              <Link to="/notifications" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
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
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`p-4 border rounded-lg transition-all duration-200 ${
                      notification.isRead
                        ? 'border-neutral-200 bg-white'
                        : 'border-primary-200 bg-primary-50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900 flex-1">{notification.message}</p>
                      {!notification.isRead && (
                        <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></span>
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