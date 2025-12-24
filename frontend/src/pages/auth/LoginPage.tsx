import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, HandHeart, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/api';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'verify-email') {
      setVerificationMessage('Please check your email and click the verification link before logging in.');
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      if (!showOtpField) {
        // First step: send email and password
        setLoginCredentials({ email: data.email, password: data.password });
        try {
          await login(data.email, data.password);
          navigate('/dashboard');
        } catch (error: any) {
          if (error.response?.data?.message === 'OTP verification required') {
            setShowOtpField(true);
            toast.success('OTP sent to your email. Please check your inbox.');
          } else if (error.message?.includes('verify your email')) {
            setVerificationMessage('Your email address is not verified. Please check your inbox for the verification link.');
          } else if (error.requires2FA) {
            navigate('/2fa-verify', { 
              state: { email: error.email, password: error.password } 
            });
          }
        }
      } else {
        // Second step: verify OTP
        if (!otpCode || otpCode.length !== 6) {
          toast.error('Please enter a valid 6-digit OTP code');
          return;
        }
        
        try {
          await login(loginCredentials.email, loginCredentials.password, otpCode);
          navigate('/dashboard');
        } catch (error: any) {
          if (error.response?.data?.error?.includes('expired')) {
            toast.error('OTP code has expired. Please request a new one.');
            setShowOtpField(false);
            setOtpCode('');
          }
        }
      }
    } catch (error: any) {
      // Other errors are handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      await login(loginCredentials.email, loginCredentials.password);
      toast.success('New OTP sent to your email');
    } catch (error: any) {
      if (error.response?.data?.message !== 'OTP verification required') {
        toast.error('Failed to resend OTP');
      }
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleResendVerification = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsResendingVerification(true);
    try {
      await authApi.resendVerification(email);
      toast.success('Verification email sent! Please check your inbox.');
      setVerificationMessage('A new verification email has been sent. Please check your inbox.');
    } catch (error: any) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your Community Support account
            </p>
          </div>



          {/* Verification Message */}
          {verificationMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">{verificationMessage}</p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline disabled:opacity-50"
                  >
                    {isResendingVerification ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* OTP Field */}
            {showOtpField && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter 6-digit OTP code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="input-field text-center text-lg tracking-widest"
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Code sent to {loginCredentials.email}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp}
                    className="text-xs text-blue-600 hover:text-blue-500 underline disabled:opacity-50"
                  >
                    {isResendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {showOtpField ? 'Verify OTP & Sign In' : 'Continue'}
            </Button>
            
            {showOtpField && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setShowOtpField(false);
                  setOtpCode('');
                }}
              >
                ← Back to Login
              </Button>
            )}
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <Link
                to="/"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;