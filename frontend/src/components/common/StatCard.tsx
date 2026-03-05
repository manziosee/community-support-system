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

// Uses hex arbitrary values because tailwind.config.js remaps all named colors to grayscale
const colorConfig: Record<string, {
  accentGrad: string;
  iconBg: string;
  iconColor: string;
  wm: string;
}> = {
  blue: {
    accentGrad: 'from-[#3b82f6] to-[#2563eb]',
    iconBg:     'bg-[#eff6ff] dark:bg-[#1e3a5f]/40',
    iconColor:  'text-[#2563eb] dark:text-[#93c5fd]',
    wm:         'text-[#dbeafe] dark:text-[#1e3a5f]',
  },
  green: {
    accentGrad: 'from-[#10b981] to-[#059669]',
    iconBg:     'bg-[#f0fdf4] dark:bg-[#14532d]/40',
    iconColor:  'text-[#059669] dark:text-[#6ee7b7]',
    wm:         'text-[#d1fae5] dark:text-[#14532d]',
  },
  yellow: {
    accentGrad: 'from-[#f59e0b] to-[#d97706]',
    iconBg:     'bg-[#fffbeb] dark:bg-[#451a03]/40',
    iconColor:  'text-[#d97706] dark:text-[#fcd34d]',
    wm:         'text-[#fde68a] dark:text-[#451a03]',
  },
  red: {
    accentGrad: 'from-[#ef4444] to-[#dc2626]',
    iconBg:     'bg-[#fef2f2] dark:bg-[#450a0a]/40',
    iconColor:  'text-[#dc2626] dark:text-[#fca5a5]',
    wm:         'text-[#fecaca] dark:text-[#450a0a]',
  },
  purple: {
    accentGrad: 'from-[#8b5cf6] to-[#7c3aed]',
    iconBg:     'bg-[#faf5ff] dark:bg-[#2e1065]/40',
    iconColor:  'text-[#7c3aed] dark:text-[#c4b5fd]',
    wm:         'text-[#e9d5ff] dark:text-[#2e1065]',
  },
  indigo: {
    accentGrad: 'from-[#6366f1] to-[#4f46e5]',
    iconBg:     'bg-[#eef2ff] dark:bg-[#1e1b4b]/40',
    iconColor:  'text-[#4f46e5] dark:text-[#a5b4fc]',
    wm:         'text-[#c7d2fe] dark:text-[#1e1b4b]',
  },
  orange: {
    accentGrad: 'from-[#f97316] to-[#ea580c]',
    iconBg:     'bg-[#fff7ed] dark:bg-[#431407]/40',
    iconColor:  'text-[#ea580c] dark:text-[#fdba74]',
    wm:         'text-[#fed7aa] dark:text-[#431407]',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title, value, icon: Icon, color = 'blue', trend, link, subtitle,
}) => {
  const cfg = colorConfig[color];

  const content = (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-crisp border border-gray-100 dark:border-slate-700/60 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${cfg.accentGrad}`} />

      {/* Watermark background icon */}
      <Icon
        className={`absolute -bottom-4 -right-4 w-28 h-28 ${cfg.wm} pointer-events-none transition-all duration-500 group-hover:scale-110`}
        style={{ opacity: 0.4 }}
      />

      <div className="p-4 lg:p-5 pl-5 lg:pl-6">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 truncate">
              {title}
            </p>
            <p className="text-2xl lg:text-3xl font-display font-black text-gray-900 dark:text-slate-100 leading-none">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{subtitle}</p>
            )}
            {trend && (
              <div
                className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? 'bg-[#f0fdf4] text-[#059669] dark:bg-[#14532d]/40 dark:text-[#6ee7b7]'
                    : 'bg-[#fef2f2] text-[#dc2626] dark:bg-[#450a0a]/40 dark:text-[#fca5a5]'
                }`}
              >
                {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          <div
            className={`w-11 h-11 ${cfg.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform duration-300 shadow-crisp`}
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
