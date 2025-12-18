import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi } from '../../services/api';
import type { Request } from '../../types';
import { RequestStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditRequestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const categories = [
    { value: 'general', label: 'General Help' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping & Errands' },
    { value: 'technology', label: 'Technology Support' },
    { value: 'tutoring', label: 'Tutoring & Education' },
    { value: 'healthcare', label: 'Healthcare Assistance' },
    { value: 'household', label: 'Household Tasks' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await requestsApi.getById(parseInt(id));
        setRequest(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          category: 'general'
        });
      } catch (error) {
        console.error('Failed to fetch request:', error);
        setRequest(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !request) return;
    
    try {
      setIsSubmitting(true);
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };
      
      await requestsApi.update(request.requestId, updateData);
      
      alert('Request updated successfully!');
      navigate(`/requests/${request.requestId}`);
    } catch (error) {
      console.error('Failed to update request:', error);
      alert('Failed to update request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading request..." />;
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Request not found</h2>
        <p className="text-gray-600 mb-4">The request you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/requests')}>
          Back to Requests
        </Button>
      </div>
    );
  }

  // Check if user can edit this request
  if (user?.userId !== request.citizen.userId) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You can only edit your own requests.</p>
        <Button onClick={() => navigate('/requests')}>
          Back to Requests
        </Button>
      </div>
    );
  }

  // Check if request can be edited
  if (request.status !== RequestStatus.PENDING) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cannot Edit Request</h2>
        <p className="text-gray-600 mb-4">Only pending requests can be edited.</p>
        <Button onClick={() => navigate(`/requests/${request.requestId}`)}>
          View Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate(`/requests/${request.requestId}`)}
        >
          Back to Request
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Request</h1>
          <p className="text-gray-600 mt-1">Update your request information</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
                <p className="text-sm text-gray-600">Update your request information</p>
              </div>
            </div>

            <Input
              label="Request Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Need help with grocery shopping"
              error={errors.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`input-field ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please provide detailed information about what help you need..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Note</h3>
              <p className="text-sm text-yellow-800">
                You can only edit requests that are still pending. Once a volunteer accepts your request, 
                you won't be able to make changes.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/requests/${request.requestId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                icon={Save}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditRequestPage;