import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-bold rounded-xl',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    'active:scale-[0.97]',
    'select-none',
  ].join(' ');

  const variantClasses: Record<string, string> = {
    primary: [
      'bg-gradient-to-r from-primary-600 to-primary-500',
      'hover:from-primary-700 hover:to-primary-600',
      'text-white font-bold',
      'shadow-sm hover:shadow-glow hover:-translate-y-0.5',
      'focus:ring-primary-500',
    ].join(' '),

    secondary: [
      'bg-white dark:bg-slate-700',
      'hover:bg-primary-50 dark:hover:bg-slate-600',
      'text-primary-700 dark:text-primary-200 font-bold',
      'border-2 border-primary-500 dark:border-primary-400',
      'hover:-translate-y-0.5 hover:border-primary-600 dark:hover:border-primary-300',
      'shadow-sm focus:ring-primary-400',
    ].join(' '),

    accent: [
      'bg-gradient-to-r from-secondary-500 to-secondary-600',
      'hover:from-secondary-600 hover:to-secondary-700',
      'text-white font-bold',
      'shadow-sm hover:shadow-glow-secondary hover:-translate-y-0.5',
      'focus:ring-secondary-400',
    ].join(' '),

    danger: [
      'bg-gradient-to-r from-red-600 to-red-500',
      'hover:from-red-700 hover:to-red-600',
      'text-white font-bold',
      'shadow-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:-translate-y-0.5',
      'focus:ring-red-500',
    ].join(' '),

    success: [
      'bg-gradient-to-r from-green-600 to-green-500',
      'hover:from-green-700 hover:to-green-600',
      'text-white font-bold',
      'shadow-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:-translate-y-0.5',
      'focus:ring-green-500',
    ].join(' '),

    outline: [
      'border-2 border-primary-500 dark:border-primary-400',
      'bg-transparent',
      'hover:bg-primary-50 dark:hover:bg-primary-900/30',
      'hover:border-primary-600 dark:hover:border-primary-300',
      'text-primary-700 dark:text-primary-300 font-bold',
      'hover:-translate-y-0.5',
      'focus:ring-primary-400',
    ].join(' '),
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className]
    .filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled || loading}>
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left'  && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
