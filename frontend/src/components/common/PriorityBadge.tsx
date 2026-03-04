import React from 'react';
import { Flame, Minus } from 'lucide-react';
import type { RequestPriority } from '../../types';

interface PriorityBadgeProps {
  priority?: RequestPriority;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority = 'NORMAL',
  size = 'sm',
  showLabel = true,
}) => {
  if (priority === 'URGENT') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-bold animate-pulse-slow border ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : 'px-2.5 py-1 text-xs'
        } bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700/40`}
      >
        <Flame className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        {showLabel && 'Urgent'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : 'px-2.5 py-1 text-xs'
      } bg-neutral-100 dark:bg-slate-700 text-neutral-500 dark:text-slate-400 border-neutral-200 dark:border-slate-600`}
    >
      <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {showLabel && 'Normal'}
    </span>
  );
};

export default PriorityBadge;
