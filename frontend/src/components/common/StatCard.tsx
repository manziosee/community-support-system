import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'orange';
  trend?: { value: number; isPositive: boolean };
  link?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, icon: Icon, color = 'blue', trend, link, subtitle,
}) => {
  const colorConfig = {
    blue: {
      accentGrad: 'from-primary-400 to-primary-600',
      iconBg: 'bg-primary-100 dark:bg-primary-900/40',
      iconColor: 'text-primary-600 dark:text-primary-400',
      wm: 'text-primary-200 dark:text-primary-900/40',
    },
    green: {
      accentGrad: 'from-green-400 to-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
      wm: 'text-green-200 dark:text-green-900/40',
    },
    yellow: {
      accentGrad: 'from-yellow-400 to-yellow-500',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      wm: 'text-yellow-200 dark:text-yellow-900/40',
    },
    red: {
      accentGrad: 'from-red-400 to-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      wm: 'text-red-200 dark:text-red-900/40',
    },
    purple: {
      accentGrad: 'from-purple-400 to-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      wm: 'text-purple-200 dark:text-purple-900/40',
    },
    indigo: {
      accentGrad: 'from-secondary-400 to-secondary-600',
      iconBg: 'bg-secondary-100 dark:bg-secondary-900/40',
      iconColor: 'text-secondary-600 dark:text-secondary-400',
      wm: 'text-secondary-200 dark:text-secondary-900/40',
    },
    orange: {
      accentGrad: 'from-orange-400 to-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
      iconColor: 'text-orange-600 dark:text-orange-400',
      wm: 'text-orange-200 dark:text-orange-900/40',
    },
  };

  const cfg = colorConfig[color];

  const content = (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700/60 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${cfg.accentGrad}`} />

      {/* Watermark background icon */}
      <Icon
        className={`absolute -bottom-4 -right-4 w-28 h-28 ${cfg.wm} pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-60`}
        style={{ opacity: 0.45 }}
      />

      <div className="p-4 lg:p-5 pl-5 lg:pl-6">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-2 truncate">
              {title}
            </p>
            <p className="text-2xl lg:text-3xl font-display font-black text-gray-900 dark:text-slate-100 leading-none">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-neutral-400 dark:text-slate-500 mt-1.5">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          <div
            className={`w-11 h-11 ${cfg.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
          >
            <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  );

  if (link) return <Link to={link} className="block">{content}</Link>;
  return content;
};

export default StatCard;
