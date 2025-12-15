import React, { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TwoFactorSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();

  const handleEnable2FA = () => {
    window.location.href = '/2fa-setup';
  };

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true);
      await authApi.disable2FA(password);
      setIsEnabled(false);
      setShowDisableModal(false);
      setPassword('');
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      toast.error('Failed to disable 2FA. Check your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isEnabled ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Shield className={`w-6 h-6 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEnabled 
                ? 'Your account is protected with 2FA'
                : 'Add an extra layer of security to your account'
              }
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          {isEnabled ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDisableModal(true)}
            >
              Disable
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleEnable2FA}
            >
              Enable 2FA
            </Button>
          )}
        </div>
      </div>

      {/* Disable 2FA Modal */}
      <Modal
        isOpen={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        title="Disable Two-Factor Authentication"
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-900">
                Security Warning
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Disabling 2FA will make your account less secure. Are you sure you want to continue?
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDisableModal(false);
                setPassword('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDisable2FA}
              loading={isLoading}
              disabled={!password || isLoading}
              className="flex-1"
            >
              Disable 2FA
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default TwoFactorSettings;