import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, HandHeart, Award, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { locationsApi, skillsApi } from '../../services/api';
import { UserRole } from '../../types';
import type { Location, Skill } from '../../types';
import Button from '../../components/common/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([UserRole.CITIZEN, UserRole.VOLUNTEER]),
  province: z.string().min(1, 'Please select a province'),
  locationId: z.number().min(1, 'Please select a district'),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
  skills: z.array(z.number()).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CITIZEN);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.CITIZEN,
      province: '',
      skills: [],
    },
  });

  const watchedRole = watch('role');
  const watchedProvince = watch('province');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsResponse, provincesResponse] = await Promise.all([
          skillsApi.getAll(),
          locationsApi.getProvinces(),
        ]);
        setSkills(skillsResponse.data);
        setProvinces(provincesResponse.data);
        console.log('Loaded provinces:', provincesResponse.data);
        console.log('Loaded skills:', skillsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedRole(watchedRole);
  }, [watchedRole]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (watchedProvince && watchedProvince !== '') {
        try {
          console.log('Fetching districts for province:', watchedProvince);
          setSelectedProvince(watchedProvince);
          const response = await locationsApi.getDistrictsByProvince(watchedProvince);
          console.log('API Response:', response);
          console.log('Districts data:', response.data);
          console.log('Districts array length:', response.data?.length);
          if (response.data && response.data.length > 0) {
            console.log('First district:', response.data[0]);
          }
          setDistricts(response.data || []);
          setValue('locationId', '' as any); // Reset district selection
        } catch (error) {
          console.error('Failed to fetch districts for', watchedProvince, ':', error);
          setDistricts([]);
        }
      } else {
        console.log('No province selected, clearing districts');
        setDistricts([]);
        setValue('locationId', '' as any);
      }
    };

    fetchDistricts();
  }, [watchedProvince, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const userData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber,
        password: data.password,
        role: data.role,
        locationId: Number(data.locationId), // Ensure locationId is a number
        sector: data.sector?.trim() || '',
        cell: data.cell?.trim() || '',
        village: data.village?.trim() || '',
        skills: (data.skills || []).map(skillId => ({
          skillId: Number(skillId) // Ensure skillId is a number
        }))
      };
      
      console.log('Submitting registration data:', userData);
      await registerUser(userData);
      toast.success('Registration successful! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillToggle = (skillId: number) => {
    const currentSkills = watch('skills') || [];
    const updatedSkills = currentSkills.includes(skillId)
      ? currentSkills.filter(id => id !== skillId)
      : [...currentSkills, skillId];
    setValue('skills', updatedSkills);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <HandHeart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Join our community
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start helping or getting help
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phoneNumber')}
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  className="input-field pl-10"
                  placeholder="0788123456"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value={UserRole.CITIZEN}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Get help from volunteers</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('role')}
                    type="radio"
                    value={UserRole.VOLUNTEER}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Help others as a volunteer</span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Location - Province and District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <select
                  {...register('province')}
                  id="province"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-black"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                >
                  <option value="" style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>Select province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province} style={{ color: '#000000', backgroundColor: '#ffffff' }}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-1">
                District {districts.length > 0 && `(${districts.length} available)`}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <select
                  {...register('locationId', { valueAsNumber: true })}
                  id="locationId"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  disabled={!selectedProvince || districts.length === 0}
                >
                  <option value="">
                    {!selectedProvince 
                      ? 'Select province first' 
                      : districts.length === 0 
                        ? 'Loading districts...' 
                        : 'Select district'
                    }
                  </option>
                  {districts.map((district, index) => (
                    <option 
                      key={index} 
                      value={district}
                    >
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              {errors.locationId && (
                <p className="mt-1 text-sm text-red-600">{errors.locationId.message}</p>
              )}
            </div>
          </div>

          {/* Additional Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                Sector
              </label>
              <input
                {...register('sector')}
                id="sector"
                type="text"
                autoComplete="address-level3"
                className="mt-1 input-field"
                placeholder="Enter your sector"
              />
            </div>
            <div>
              <label htmlFor="cell" className="block text-sm font-medium text-gray-700">
                Cell
              </label>
              <input
                {...register('cell')}
                id="cell"
                type="text"
                autoComplete="address-level4"
                className="mt-1 input-field"
                placeholder="Enter your cell"
              />
            </div>
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                Village
              </label>
              <input
                {...register('village')}
                id="village"
                type="text"
                autoComplete="address-line1"
                className="mt-1 input-field"
                placeholder="Enter your village"
              />
            </div>
          </div>

          {/* Skills (only for volunteers) */}
          {selectedRole === UserRole.VOLUNTEER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Award className="inline w-4 h-4 mr-1" />
                Select your skills
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <label
                    key={skill.skillId}
                    className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={(watch('skills') || []).includes(skill.skillId)}
                      onChange={() => handleSkillToggle(skill.skillId)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{skill.skillName}</p>
                      <p className="text-xs text-gray-500">{skill.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;