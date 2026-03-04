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
  const variantClasses = {
    primary:   'bg-primary-100 dark:bg-primary-900/50   text-primary-800 dark:text-primary-200   border border-primary-300 dark:border-primary-600/60',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-800 dark:text-secondary-200 border border-secondary-300 dark:border-secondary-600/60',
    success:   'bg-green-100 dark:bg-green-900/50       text-green-800 dark:text-green-200       border border-green-300 dark:border-green-600/60',
    warning:   'bg-yellow-100 dark:bg-yellow-900/50     text-yellow-800 dark:text-yellow-200     border border-yellow-300 dark:border-yellow-600/60',
    danger:    'bg-red-100 dark:bg-red-900/50           text-red-800 dark:text-red-200           border border-red-300 dark:border-red-600/60',
    info:      'bg-blue-100 dark:bg-blue-900/50         text-blue-800 dark:text-blue-200         border border-blue-300 dark:border-blue-600/60',
    accent:    'bg-accent-100 dark:bg-accent-900/50     text-accent-800 dark:text-accent-200     border border-accent-300 dark:border-accent-600/60',
    gray:      'bg-neutral-100 dark:bg-slate-700        text-neutral-800 dark:text-slate-200     border border-neutral-300 dark:border-slate-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
