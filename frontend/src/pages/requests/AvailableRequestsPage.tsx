import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, MapPin, User, Clock, CheckSquare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi, assignmentsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const AvailableRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('MY_PROVINCE');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Try to get requests by volunteer's province first
        const userProvince = user.province || user.location?.province;
        let response;
        
        if (userProvince && locationFilter === 'MY_PROVINCE') {
          try {
            response = await requestsApi.getByProvince(userProvince);
            // Filter to only pending requests
            const pendingRequests = response.data.filter((r: Request) => r.status === 'PENDING');
            setRequests(pendingRequests);
          } catch (error) {
            console.log('Province-specific request failed, falling back to all pending requests');
            response = await requestsApi.getPending();
            setRequests(response.data || []);
          }
        } else {
          response = await requestsApi.getPending();
          setRequests(response.data || []);
        }
        
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        toast.error('Failed to load available requests');
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user, locationFilter]);

  useEffect(() => {
    let filtered = requests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter (only if not already filtered by backend)
    if (locationFilter !== 'MY_PROVINCE' && locationFilter !== 'ALL') {
      filtered = filtered.filter(request => {
        const requestProvince = request.citizen.province || request.citizen.location?.province;
        return requestProvince === locationFilter;
      });
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, locationFilter]);

  const handleAcceptRequest = async (requestId: number) => {
    if (!user) return;
    
    try {
      await assignmentsApi.create({
        request: { requestId },
        volunteer: { userId: user.userId }
      });
      
      setRequests(prev => prev.filter(r => r.requestId !== requestId));
      toast.success('Request accepted successfully! Check your assignments.');
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error('Failed to accept request. Please try again.');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('available_requests_just_now');
    if (diffInHours < 24) return `${diffInHours}${t('available_requests_hours_ago')}`;
    return `${Math.floor(diffInHours / 24)}${t('available_requests_days_ago')}`;
  };

  const provinces = [...new Set(requests.map(r => r.citizen.province || r.citizen.location?.province).filter(Boolean))];

  if (isLoading) {
    return <LoadingSpinner size="lg" text={t('common_loading')} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('available_requests_title')}</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">{t('available_requests_subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('available_requests_available')}</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('available_requests_your_area')}</p>
              <p className="text-lg font-bold text-gray-900">{user?.district || user?.location?.district}</p>
              <p className="text-xs text-gray-500">{user?.province || user?.location?.province}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('available_requests_your_skills')}</p>
              <p className="text-lg font-bold text-gray-900">{user?.skills?.length || 0}</p>
              <p className="text-xs text-gray-500">{t('available_requests_skills_count')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('available_requests_search_placeholder')}
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="MY_PROVINCE">{t('available_requests_my_province')} ({user?.province || user?.location?.province || 'Not set'})</option>
              <option value="ALL">{t('available_requests_all_locations')}</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('available_requests_no_requests')}
            description={t('available_requests_no_requests_desc')}
          />
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.requestId} hover>
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">{request.title}</h3>
                    <Badge variant="warning">{t('available_requests_new')}</Badge>
                  </div>

                  <p className="text-gray-600 dark:text-slate-400 mb-4">{request.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1 flex-shrink-0" />
                      {request.citizen.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      {(request.citizen.district || request.citizen.location?.district)}, {(request.citizen.province || request.citizen.location?.province)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                      {getTimeAgo(request.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Link to={`/requests/${request.requestId}`}>
                    <Button variant="view" icon={Eye}>
                      {t('requests_view')}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAcceptRequest(request.requestId)}
                    icon={CheckSquare}
                  >
                    {t('available_requests_accept')}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableRequestsPage;