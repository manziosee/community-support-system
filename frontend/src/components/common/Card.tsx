import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  interactive = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = 'bg-white dark:bg-slate-800 rounded-xl shadow-crisp border border-gray-100 dark:border-slate-700/60 transition-colors duration-200';
  const hoverClasses = hover ? 'hover:shadow-soft hover:border-gray-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300' : '';
  const interactiveClasses = interactive ? 'hover:shadow-lifted hover:border-gray-400 dark:hover:border-slate-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${interactiveClasses} ${clickableClasses} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
