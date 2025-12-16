import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, FileText, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0
  });

  const mockRequests: Request[] = [
    {
      requestId: 1,
      title: 'Grocery Shopping Assistance',
      description: 'Need help with weekly grocery shopping due to mobility issues',
      category: 'SHOPPING_AND_ERRANDS' as any,
      status: RequestStatus.ACCEPTED,
      createdAt: '2024-03-15T10:00:00Z',
      citizen: user!
    },
    {
      requestId: 2,
      title: 'Computer Setup Help',
      description: 'Need assistance setting up new laptop and installing software',
      category: 'TECHNOLOGY_SUPPORT' as any,
      status: RequestStatus.PENDING,
      createdAt: '2024-03-14T14:30:00Z',
      citizen: user!
    },
    {
      requestId: 3,
      title: 'Math Tutoring Session',
      description: 'Need help with calculus homework and exam preparation',
      category: 'TUTORING_AND_EDUCATION' as any,
      status: RequestStatus.COMPLETED,
      createdAt: '2024-03-13T09:00:00Z',
      citizen: user!
    }
  ];

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      try {
        const response = await requestsApi.getByCitizen(user.userId);
        setRequests(response.data);
      } catch (error) {
        setRequests(mockRequests);
      }
    } catch (error) {
      setRequests(mockRequests);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setStats({
      total: requests.length,
      pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
      accepted: requests.filter(r => r.status === RequestStatus.ACCEPTED).length,
      completed: requests.filter(r => r.status === RequestStatus.COMPLETED).length
    });
  }, [requests]);

  useEffect(() => {
    let filtered = requests;
    console.log('Filtering requests:', { totalRequests: requests.length, statusFilter, searchTerm });

    // Filter by status
    if (statusFilter !== 'all') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(r => r.status === statusFilter);
      console.log(`Status filter '${statusFilter}': ${beforeFilter} -> ${filtered.length}`);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`Search filter '${searchTerm}': ${beforeSearch} -> ${filtered.length}`);
    }

    // Sort by creation date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('Final filtered requests:', filtered.length);
    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    setRequests(prev => prev.filter(r => r.requestId !== id));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'warning';
      case RequestStatus.ACCEPTED:
        return 'info';
      case RequestStatus.COMPLETED:
        return 'success';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading your requests..." />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100';
      case 'ACCEPTED':
        return 'text-blue-700 bg-blue-100';
      case 'COMPLETED':
        return 'text-green-700 bg-green-100';
      case 'CANCELLED':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, request: Request) => (
        <div className="flex items-center space-x-2">
          <Link to={`/requests/${request.requestId}`}>
            <Button size="sm" variant="outline" icon={Eye}>
              View
            </Button>
          </Link>
          {request.status === 'PENDING' && (
            <>
              <Link to={`/requests/${request.requestId}/edit`}>
                <Button size="sm" variant="outline" icon={Edit}>
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="danger"
                icon={Trash2}
                onClick={() => handleDelete(request.requestId)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600">Manage your help requests</p>
        </div>
        <Link to="/requests/create">
          <Button icon={Plus}>
            Create Request
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
              placeholder="Search requests by title or description..."
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
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Accepted ({stats.accepted})
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed ({stats.completed})
              </button>
            </div>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={requests.length === 0 ? "No requests yet" : "No requests found"}
            description={
              requests.length === 0 
                ? "Create your first request to get help from volunteers"
                : searchTerm 
                  ? `No requests match "${searchTerm}"${statusFilter !== 'all' ? ` in ${statusFilter.toLowerCase()} requests` : ''}`
                  : `No ${statusFilter === 'all' ? '' : statusFilter.toLowerCase()} requests found`
            }
            actionLabel={requests.length === 0 ? "Create Request" : undefined}
            onAction={requests.length === 0 ? () => window.location.href = '/requests/create' : undefined}
          />
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.requestId} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{request.title}</h3>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{request.description}</p>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-6">
                  <Link to={`/requests/${request.requestId}`}>
                    <Button size="sm" variant="secondary" icon={Eye}>
                      View
                    </Button>
                  </Link>
                  {request.status === RequestStatus.PENDING && (
                    <>
                      <Link to={`/requests/${request.requestId}/edit`}>
                        <Button size="sm" variant="secondary" icon={Edit}>
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => handleDelete(request.requestId)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;