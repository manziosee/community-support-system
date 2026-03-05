import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  // B&W palette — each variant uses a distinct shade tier for visual hierarchy
  const variantClasses: Record<string, string> = {
    primary:   'bg-gray-900  text-white     border border-gray-900  dark:bg-gray-100  dark:text-gray-900  dark:border-gray-200',
    secondary: 'bg-gray-700  text-white     border border-gray-700  dark:bg-gray-200  dark:text-gray-800  dark:border-gray-300',
    success:   'bg-gray-800  text-white     border border-gray-800  dark:bg-gray-200  dark:text-gray-800  dark:border-gray-300',
    warning:   'bg-gray-200  text-gray-800  border border-gray-400  dark:bg-gray-700  dark:text-gray-100  dark:border-gray-600',
    danger:    'bg-black     text-white     border border-black     dark:bg-gray-50   dark:text-gray-900  dark:border-gray-300',
    info:      'bg-gray-100  text-gray-700  border border-gray-300  dark:bg-gray-700  dark:text-gray-200  dark:border-gray-600',
    accent:    'bg-gray-600  text-white     border border-gray-600  dark:bg-gray-300  dark:text-gray-900  dark:border-gray-400',
    gray:      'bg-gray-100  text-gray-600  border border-gray-200  dark:bg-gray-800  dark:text-gray-300  dark:border-gray-700',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
