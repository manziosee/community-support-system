import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, Loader } from 'lucide-react';
import { authApi } from '../../services/api';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in to your account.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      toast.success('Verification email sent! Please check your inbox.');
      setResendEmail('');
    } catch (error: any) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center">
            {status === 'loading' && (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h2>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <p className={`text-sm ${
              status === 'success' ? 'text-green-600' : 
              status === 'error' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {message}
            </p>

            {status === 'loading' && (
              <p className="text-xs text-gray-500">
                Please wait while we verify your email address...
              </p>
            )}
          </div>

          {/* Actions */}
          {status !== 'loading' && (
            <div className="space-y-4">
              {status === 'success' && (
                <Link to="/login">
                  <Button className="w-full">
                    Continue to Login
                  </Button>
                </Link>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resend verification email:
                    </label>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button 
                      onClick={handleResendVerification}
                      disabled={!resendEmail || isResending}
                      loading={isResending}
                      variant="secondary"
                      className="w-full"
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/register">
                      <Button variant="outline" className="w-full">
                        Try Registration Again
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button className="w-full">
                        Go to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <Link 
                to="/" 
                className="block text-sm text-gray-600 hover:text-gray-500"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;