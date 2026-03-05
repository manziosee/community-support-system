import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text, fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-2',
    lg: 'w-14 h-14 border-[3px]',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Track ring */}
        <div className={`${sizeClasses[size]} border-gray-200 dark:border-gray-700 rounded-full`} />
        {/* Spin ring */}
        <div className={`${sizeClasses[size]} border-gray-900 dark:border-gray-100 border-t-transparent rounded-full animate-spin absolute inset-0`} />
      </div>
      {text && (
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export default LoadingSpinner;
