import React from 'react';
import { Link } from 'react-router-dom';

interface SectionCardProps {
  title: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  headerClassName?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  viewAllLink,
  viewAllLabel = 'View all →',
  headerClassName = 'bg-gradient-to-r from-neutral-50 to-white dark:from-slate-800 dark:to-slate-800',
  children,
  headerRight,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700/60 overflow-hidden transition-all duration-200 hover:shadow-card">
      <div className={`px-5 py-4 border-b border-neutral-100 dark:border-slate-700/60 ${headerClassName}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          {headerRight ?? (
            viewAllLink ? (
              <Link
                to={viewAllLink}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
              >
                {viewAllLabel}
              </Link>
            ) : null
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default SectionCard;
