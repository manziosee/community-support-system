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
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const iconCls = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (priority === 'URGENT') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-bold animate-pulse-slow border ${sizeCls}
          bg-black text-white border-gray-700 dark:bg-white dark:text-gray-900 dark:border-gray-300`}
      >
        <Flame className={iconCls} />
        {showLabel && 'Urgent'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${sizeCls}
        bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-600`}
    >
      <Minus className={iconCls} />
      {showLabel && 'Normal'}
    </span>
  );
};

export default PriorityBadge;
