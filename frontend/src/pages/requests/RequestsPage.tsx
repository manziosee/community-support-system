import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, FileText, Clock, CheckCircle, Search, Filter, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { exportToCSV } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

const RequestsPage: React.FC = () => {
  const { t } = useTranslation();
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



  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await requestsApi.getByCitizen(user.userId);
      setRequests(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load requests');
      setRequests([]);
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
    if (!window.confirm(t('requests_confirm_delete'))) return;
    
    try {
      await requestsApi.delete(id);
      setRequests(prev => prev.filter(r => r.requestId !== id));
      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    }
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
    return <LoadingSpinner size="lg" text={t('common_loading')} />;
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
            <Button size="sm" variant="view" icon={Eye}>
              View
            </Button>
          </Link>
          {request.status === 'PENDING' && (
            <>
              <Link to={`/requests/${request.requestId}/edit`}>
                <Button size="sm" variant="edit" icon={Edit}>
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="delete"
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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t('requests_title')}</h1>
          <p className="text-sm text-neutral-500 dark:text-slate-400 mt-0.5">{t('requests_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="export"
            icon={Download}
            onClick={() => {
              const rows = filteredRequests.map((r) => ({
                ID: r.requestId,
                Title: r.title,
                Status: r.status,
                Category: r.category ?? '',
                'Created At': new Date(r.createdAt).toLocaleDateString(),
              }));
              exportToCSV(rows as Record<string, unknown>[], 'my_requests');
            }}
            disabled={filteredRequests.length === 0}
          >
            {t('requests_export')}
          </Button>
          <Link to="/requests/create">
            <Button icon={Plus}>{t('requests_create')}</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('requests_total')}</p>
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
              <p className="text-sm font-medium text-gray-600">{t('status_pending')}</p>
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
              <p className="text-sm font-medium text-gray-600">{t('status_accepted')}</p>
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
              <p className="text-sm font-medium text-gray-600">{t('status_completed')}</p>
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
              placeholder={t('requests_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('requests_all')} ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('status_pending')} ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter('ACCEPTED')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'ACCEPTED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('status_accepted')} ({stats.accepted})
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t('status_completed')} ({stats.completed})
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
                {t('requests_clear_filters')}
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
            title={requests.length === 0 ? t('requests_no_requests') : t('requests_no_match')}
            description={
              requests.length === 0 
                ? t('requests_no_requests_desc')
                : searchTerm 
                  ? `${t('requests_no_match')} "${searchTerm}"${statusFilter !== 'all' ? ` in ${statusFilter.toLowerCase()} requests` : ''}`
                  : `No ${statusFilter === 'all' ? '' : statusFilter.toLowerCase()} requests found`
            }
            actionLabel={requests.length === 0 ? t('requests_create') : undefined}
            onAction={requests.length === 0 ? () => window.location.href = '/requests/create' : undefined}
          />
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.requestId} hover>
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">{request.title}</h3>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-slate-400 mb-4">{request.description}</p>
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    {t('requests_created')}: {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                  <Link to={`/requests/${request.requestId}`}>
                    <Button size="sm" variant="view" icon={Eye}>
                      {t('requests_view')}
                    </Button>
                  </Link>
                  {request.status === RequestStatus.PENDING && (
                    <>
                      <Link to={`/requests/${request.requestId}/edit`}>
                        <Button size="sm" variant="edit" icon={Edit}>
                          {t('requests_edit')}
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="delete"
                        icon={Trash2}
                        onClick={() => handleDelete(request.requestId)}
                      >
                        {t('requests_delete')}
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