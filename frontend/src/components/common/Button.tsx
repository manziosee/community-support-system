import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'outline' | 'create' | 'edit' | 'delete' | 'view' | 'export' | 'analytics';
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
    'inline-flex items-center justify-center font-semibold rounded-xl',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'active:scale-[0.97]',
    'select-none',
  ].join(' ');

  const variantClasses: Record<string, string> = {
    // Primary — solid black
    primary: [
      'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
      'hover:bg-black dark:hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-gray-900',
      'shadow-crisp',
    ].join(' '),

    // Secondary — outlined B&W
    secondary: [
      'bg-white dark:bg-neutral-900 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100',
      'hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 hover:-translate-y-0.5',
      'focus:ring-gray-900',
    ].join(' '),

    // Accent — dark gray
    accent: [
      'bg-gray-700 text-white',
      'hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-gray-700',
      'shadow-crisp',
    ].join(' '),

    // Danger — dark gray (semantic severity, not CRUD)
    danger: [
      'bg-gray-800 text-white',
      'hover:bg-black hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-gray-800',
      'shadow-crisp',
    ].join(' '),

    // Success — medium gray
    success: [
      'bg-gray-600 text-white',
      'hover:bg-gray-700 hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-gray-600',
      'shadow-crisp',
    ].join(' '),

    // Outline — light border
    outline: [
      'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200',
      'hover:border-gray-900 dark:hover:border-gray-100 hover:text-gray-900 dark:hover:text-white hover:-translate-y-0.5',
      'focus:ring-gray-900',
    ].join(' '),

    // Create — teal (add / new)
    create: [
      'bg-[#0d9488] text-white',
      'hover:bg-[#0f766e] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#0d9488]',
      'shadow-crisp',
    ].join(' '),

    // Edit — blue (modify)
    edit: [
      'bg-[#2563eb] text-white',
      'hover:bg-[#1d4ed8] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#2563eb]',
      'shadow-crisp',
    ].join(' '),

    // Delete — red (remove)
    delete: [
      'bg-[#dc2626] text-white',
      'hover:bg-[#b91c1c] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#dc2626]',
      'shadow-crisp',
    ].join(' '),

    // View — purple (inspect / read-only)
    view: [
      'bg-[#7c3aed] text-white',
      'hover:bg-[#6d28d9] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#7c3aed]',
      'shadow-crisp',
    ].join(' '),

    // Export — orange (download data)
    export: [
      'bg-[#ea580c] text-white',
      'hover:bg-[#c2410c] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#ea580c]',
      'shadow-crisp',
    ].join(' '),

    // Analytics — indigo (insights / reports)
    analytics: [
      'bg-[#4f46e5] text-white',
      'hover:bg-[#4338ca] hover:-translate-y-0.5 hover:shadow-lifted',
      'focus:ring-[#4f46e5]',
      'shadow-crisp',
    ].join(' '),
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  };

  const disabledClasses = disabled || loading ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

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
