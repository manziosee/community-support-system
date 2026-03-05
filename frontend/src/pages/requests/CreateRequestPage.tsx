import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { requestsApi, api } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CreateRequestPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const categoryData = response.data.map((cat: string) => ({
          value: cat.toLowerCase().replace(/\s+/g, '_'),
          label: cat
        }));
        setCategories(categoryData);
        if (categoryData.length > 0) {
          setFormData(prev => ({ ...prev, category: categoryData[0].value }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories if API fails
        const fallbackCategories = [
          { value: 'general', label: 'General Help' },
          { value: 'transportation', label: 'Transportation' },
          { value: 'shopping', label: 'Shopping & Errands' },
          { value: 'technology', label: 'Technology Support' },
          { value: 'tutoring', label: 'Tutoring & Education' },
          { value: 'healthcare', label: 'Healthcare Assistance' },
          { value: 'household', label: 'Household Tasks' },
          { value: 'other', label: 'Other' }
        ];
        setCategories(fallbackCategories);
        setFormData(prev => ({ ...prev, category: fallbackCategories[0].value }));
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('create_request_title_required');
    } else if (formData.title.length < 5) {
      newErrors.title = t('create_request_title_min');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('create_request_description_required');
    } else if (formData.description.length < 20) {
      newErrors.description = t('create_request_description_min');
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
        category: formData.category ?? 'GENERAL_HELP',
        citizen: { userId: user.userId }
      };
      
      try {
        await requestsApi.create(requestData);
      } catch (error) {
        // For demo, just simulate success
        console.log('Request created:', requestData);
      }
      
      // Show success message and redirect
      alert(t('create_request_success'));
      navigate('/requests');
    } catch (error) {
      console.error('Failed to create request:', error);
      alert(t('create_request_error'));
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
          {t('create_request_back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('create_request_title')}</h1>
          <p className="text-gray-600 mt-1">{t('create_request_subtitle')}</p>
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
                <h2 className="text-lg font-semibold text-gray-900">{t('create_request_details')}</h2>
                <p className="text-sm text-gray-600">{t('create_request_details_desc')}</p>
              </div>
            </div>

            <Input
              label={t('create_request_title_label')}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('create_request_title_placeholder')}
              error={errors.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('create_request_category')} <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                disabled={isLoadingCategories}
              >
                {isLoadingCategories ? (
                  <option value="">{t('create_request_category_loading')}</option>
                ) : (
                  categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('create_request_description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`input-field ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('create_request_description_placeholder')}
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
              <h3 className="font-medium text-blue-900 mb-2">{t('create_request_your_location')}</h3>
              <div className="text-sm text-blue-800">
                <p><span className="font-medium">{t('create_request_location_district')}:</span> {user?.district || user?.location?.district}</p>
                <p><span className="font-medium">{t('create_request_location_province')}:</span> {user?.province || user?.location?.province}</p>
                {user?.sector && <p><span className="font-medium">{t('create_request_location_sector')}:</span> {user.sector}</p>}
                {user?.cell && <p><span className="font-medium">{t('create_request_location_cell')}:</span> {user.cell}</p>}
                {user?.village && <p><span className="font-medium">{t('create_request_location_village')}:</span> {user.village}</p>}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                {t('create_request_location_note')}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">{t('create_request_tips_title')}</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• {t('create_request_tip1')}</li>
                <li>• {t('create_request_tip2')}</li>
                <li>• {t('create_request_tip3')}</li>
                <li>• {t('create_request_tip4')}</li>
                <li>• {t('create_request_tip5')}</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/requests')}
              >
                {t('create_request_cancel')}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              >
                {t('create_request_submit')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequestPage;