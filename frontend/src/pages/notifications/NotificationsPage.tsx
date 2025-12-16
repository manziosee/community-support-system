import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Eye, X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsApi } from '../../services/api';
import type { Notification } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });

  // Mock notifications for demonstration
  const mockNotifications: Notification[] = [
    {
      notificationId: 1,
      message: 'Your request "Grocery Shopping Help" has been accepted by John Volunteer',
      isRead: false,
      createdAt: '2024-03-15T10:30:00Z',
      user: user!
    },
    {
      notificationId: 2,
      message: 'New request available in your area: "Computer Setup Assistance"',
      isRead: false,
      createdAt: '2024-03-15T09:15:00Z',
      user: user!
    },
    {
      notificationId: 3,
      message: 'Your assignment "Tutoring Session" has been marked as completed',
      isRead: true,
      createdAt: '2024-03-14T16:45:00Z',
      user: user!
    },
    {
      notificationId: 4,
      message: 'Welcome to Community Support System! Complete your profile to get started.',
      isRead: true,
      createdAt: '2024-03-10T08:00:00Z',
      user: user!
    },
    {
      notificationId: 5,
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      isRead: false,
      createdAt: '2024-03-15T14:20:00Z',
      user: user!
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Try to fetch from API, fallback to mock data
        try {
          const response = await notificationsApi.getByUser(user.userId);
          setNotifications(response.data);
        } catch (error) {
          // Use mock data if API fails
          setNotifications(mockNotifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications(mockNotifications);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    let filtered = notifications;
    console.log('Filtering notifications:', { totalNotifications: notifications.length, filter, searchTerm });

    // Filter by read status
    if (filter === 'unread') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(n => n.isRead === false);
      console.log(`Unread filter: ${beforeFilter} -> ${filtered.length}`);
    } else if (filter === 'read') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(n => n.isRead === true);
      console.log(`Read filter: ${beforeFilter} -> ${filtered.length}`);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(n => 
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`Search filter '${searchTerm}': ${beforeSearch} -> ${filtered.length}`);
    }

    // Sort by creation date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('Final filtered notifications:', filtered.length);
    setFilteredNotifications(filtered);

    // Update stats
    setStats({
      total: notifications.length,
      unread: notifications.filter(n => n.isRead === false).length,
      read: notifications.filter(n => n.isRead === true).length,
    });
  }, [notifications, filter, searchTerm]);

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.notificationId === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (error) {
      // For demo, just update locally
      setNotifications(prev => 
        prev.map(n => 
          n.notificationId === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationsApi.markAllAsRead(user.userId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      // For demo, just update locally
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await notificationsApi.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    } catch (error) {
      // For demo, just update locally
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your community activities</p>
        </div>
        {stats.unread > 0 && (
          <Button onClick={markAllAsRead} icon={CheckCheck}>
            Mark All Read
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread ({stats.unread})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Read ({stats.read})
              </button>
            </div>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Notifications' : 
             filter === 'unread' ? 'Unread Notifications' : 'Read Notifications'}
            ({filteredNotifications.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Bell}
                title="No notifications found"
                description={
                  searchTerm 
                    ? `No notifications match "${searchTerm}"${filter !== 'all' ? ` in ${filter} notifications` : ''}`
                    : `No ${filter === 'all' ? '' : filter} notifications found`
                }
              />
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm text-gray-900 flex-1">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <Badge variant="info" size="sm">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={() => setSelectedNotification(notification)}
                    >
                      View
                    </Button>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Check}
                        onClick={() => markAsRead(notification.notificationId)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => deleteNotification(notification.notificationId)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notification Details</h2>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedNotification.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!selectedNotification.isRead && (
                    <Badge variant="info" size="sm">
                      Unread
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={X}
                    onClick={() => setSelectedNotification(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="ml-2">
                    {selectedNotification.isRead ? (
                      <Badge variant="success" size="sm">Read</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">Unread</Badge>
                    )}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Notification ID:</span>
                  <span className="ml-2 text-gray-900">#{selectedNotification.notificationId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Received:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Recipient:</span>
                  <span className="ml-2 text-gray-900">
                    {selectedNotification.user.name}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                {!selectedNotification.isRead && (
                  <Button
                    variant="secondary"
                    icon={Check}
                    onClick={() => {
                      markAsRead(selectedNotification.notificationId);
                      setSelectedNotification(null);
                    }}
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => {
                    deleteNotification(selectedNotification.notificationId);
                    setSelectedNotification(null);
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedNotification(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;