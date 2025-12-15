import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TwoFactorVerifyPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || '';
  const password = location.state?.password || '';

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.verify2FA({
        email,
        password,
        code: verificationCode,
        isBackupCode: useBackupCode
      });
      
      // Complete login process
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(useBackupCode ? 'Invalid backup code' : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await authApi.resend2FACode(email);
      toast.success('New verification code sent to your email');
    } catch (error) {
      toast.error('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Two-Factor Authentication
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {useBackupCode 
                ? 'Enter one of your backup codes'
                : 'Enter the verification code sent to your email'
              }
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {useBackupCode ? 'Backup Code' : 'Verification Code'}
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                placeholder={useBackupCode ? "Enter backup code" : "000000"}
                maxLength={useBackupCode ? 10 : 6}
              />
            </div>

            <Button
              onClick={handleVerify}
              loading={isLoading}
              disabled={verificationCode.length < (useBackupCode ? 8 : 6)}
              className="w-full"
            >
              Verify & Sign In
            </Button>

            <div className="flex flex-col space-y-3">
              {!useBackupCode && (
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  icon={RefreshCw}
                  disabled={isLoading}
                  className="w-full"
                >
                  Resend Code
                </Button>
              )}

              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode);
                  setVerificationCode('');
                }}
                className="text-sm text-blue-600 hover:text-blue-500 underline"
              >
                {useBackupCode 
                  ? 'Use verification code instead'
                  : 'Use backup code instead'
                }
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorVerifyPage;