import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, MapPin, User, Clock, CheckSquare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi, assignmentsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const AvailableRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await requestsApi.getPending();
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== 'ALL') {
      filtered = filtered.filter(request => request.citizen.location.province === locationFilter);
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
      alert('Request accepted successfully! You can view it in your assignments.');
    } catch (error) {
      console.error('Failed to accept request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const provinces = [...new Set(requests.map(r => r.citizen.location.province))];

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading available requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Requests</h1>
          <p className="text-gray-600 mt-1">Help your community by accepting requests that match your skills</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Requests</p>
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
              <p className="text-sm font-medium text-gray-600">Your Area</p>
              <p className="text-lg font-bold text-gray-900">{user?.location.district}</p>
              <p className="text-xs text-gray-500">{user?.location.province}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Your Skills</p>
              <p className="text-lg font-bold text-gray-900">{user?.skills?.length || 0}</p>
              <p className="text-xs text-gray-500">Available skills</p>
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
                placeholder="Search requests by title or description..."
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
              <option value="ALL">All Locations</option>
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
            title="No available requests"
            description="There are no requests available at the moment. Check back later!"
          />
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.requestId} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">{request.title}</h3>
                    <Badge variant="warning">New</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{request.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {request.citizen.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {request.citizen.location.district}, {request.citizen.location.province}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {getTimeAgo(request.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <Link to={`/requests/${request.requestId}`}>
                    <Button variant="secondary" icon={Eye}>
                      View
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAcceptRequest(request.requestId)}
                    icon={CheckSquare}
                  >
                    Accept
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