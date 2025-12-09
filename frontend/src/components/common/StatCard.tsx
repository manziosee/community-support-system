import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  link,
}) => {
  const colorClasses = {
    blue: { bg: 'from-primary-500 to-secondary-600', icon: 'bg-primary-100 text-primary-600' },
    green: { bg: 'from-success-500 to-primary-500', icon: 'bg-success-100 text-success-600' },
    yellow: { bg: 'from-yellow-500 to-success-500', icon: 'bg-yellow-100 text-yellow-600' },
    red: { bg: 'from-red-500 to-accent-500', icon: 'bg-red-100 text-red-600' },
    purple: { bg: 'from-secondary-500 to-accent-500', icon: 'bg-secondary-100 text-secondary-600' },
    indigo: { bg: 'from-secondary-600 to-primary-500', icon: 'bg-secondary-100 text-secondary-600' },
    orange: { bg: 'from-accent-500 to-secondary-500', icon: 'bg-accent-100 text-accent-600' },
  };

  const content = (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color].icon} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.isPositive ? 'bg-success-100 text-success-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export default StatCard;