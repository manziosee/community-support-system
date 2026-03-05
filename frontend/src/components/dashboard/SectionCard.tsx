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
  headerClassName = 'bg-gray-50 dark:bg-slate-800',
  children,
  headerRight,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-crisp border border-gray-100 dark:border-slate-700/60 overflow-hidden transition-all duration-200 hover:shadow-soft">
      <div className={`px-5 py-4 border-b border-gray-100 dark:border-slate-700/60 ${headerClassName}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          {headerRight ?? (
            viewAllLink ? (
              <Link
                to={viewAllLink}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-slate-400
                  hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
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
