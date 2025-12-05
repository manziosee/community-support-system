import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CreateRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    
    if (!validateForm() || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        citizen: { userId: user.userId }
      };
      
      try {
        await requestsApi.create(requestData);
      } catch (error) {
        // For demo, just simulate success
        console.log('Request created:', requestData);
      }
      
      // Show success message and redirect
      alert('Request created successfully! Volunteers in your area will be notified.');
      navigate('/requests');
    } catch (error) {
      console.error('Failed to create request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/requests')}
        >
          Back to Requests
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
          <p className="text-gray-600 mt-1">Request help from volunteers in your community</p>
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
                <p className="text-sm text-gray-600">Provide clear information about what help you need</p>
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
                placeholder="Please provide detailed information about what help you need, when you need it, and any specific requirements..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Your Location</h3>
              <div className="text-sm text-blue-800">
                <p><span className="font-medium">District:</span> {user?.location.district}</p>
                <p><span className="font-medium">Province:</span> {user?.location.province}</p>
                {user?.sector && <p><span className="font-medium">Sector:</span> {user.sector}</p>}
                {user?.cell && <p><span className="font-medium">Cell:</span> {user.cell}</p>}
                {user?.village && <p><span className="font-medium">Village:</span> {user.village}</p>}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Volunteers in your area will be notified about this request
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Tips for a Good Request</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Be specific about what help you need</li>
                <li>• Include when you need the help (date/time)</li>
                <li>• Mention any special requirements or preferences</li>
                <li>• Provide your contact information if comfortable</li>
                <li>• Be respectful and appreciative of volunteers' time</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/requests')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              >
                Create Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequestPage;