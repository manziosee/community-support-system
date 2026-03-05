import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: 'sm' | 'md';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <div className={`text-center ${isSm ? 'py-8' : 'py-12'}`}>
      <div className="relative inline-flex items-center justify-center mb-4">
        {/* Outer subtle ring */}
        <div className={`${isSm ? 'w-14 h-14' : 'w-20 h-20'} bg-gray-100 dark:bg-slate-700 rounded-full opacity-40`} />
        {/* Middle ring */}
        <div className={`${isSm ? 'w-10 h-10' : 'w-14 h-14'} bg-gray-100 dark:bg-slate-700 rounded-full absolute`} />
        {/* Icon container */}
        <div className={`${isSm ? 'w-10 h-10' : 'w-14 h-14'} bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-full flex items-center justify-center absolute shadow-crisp`}>
          <Icon className={`${isSm ? 'w-5 h-5' : 'w-7 h-7'} text-gray-400 dark:text-slate-500`} />
        </div>
      </div>
      <h3 className={`${isSm ? 'text-sm' : 'text-base'} font-bold text-gray-800 dark:text-slate-100 mb-1`}>{title}</h3>
      {description && (
        <p className={`${isSm ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-slate-400 mb-5 max-w-xs mx-auto leading-relaxed`}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
