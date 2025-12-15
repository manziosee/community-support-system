import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Copy, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

const TwoFactorSetupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      await authApi.send2FACode();
      toast.success('Verification code sent to your email');
      setStep(2);
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.verify2FASetup(verificationCode);
      setBackupCodes(response.data.backupCodes);
      toast.success('Two-factor authentication enabled successfully');
      setStep(3);
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    toast.success('Backup codes copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Enable Two-Factor Authentication
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Email Verification</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      We'll send a verification code to your registered email address.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleSendCode}
                loading={isLoading}
                className="w-full"
              >
                Send Verification Code
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Check your email for the 6-digit verification code
                </p>
              </div>
              
              <Button
                onClick={handleVerifyCode}
                loading={isLoading}
                disabled={verificationCode.length !== 6}
                className="w-full"
              >
                Verify Code
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  2FA Enabled Successfully!
                </h3>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">
                  Save Your Backup Codes
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Store these codes safely. You can use them to access your account if you lose access to your email.
                </p>
                
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="py-1">{code}</div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBackupCodes}
                  icon={copied ? Check : Copy}
                  className="mt-3 w-full"
                >
                  {copied ? 'Copied!' : 'Copy Backup Codes'}
                </Button>
              </div>

              <Button onClick={handleComplete} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorSetupPage;