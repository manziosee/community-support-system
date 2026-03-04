import React from 'react';
import {
  HelpCircle,
  Car,
  Monitor,
  ShoppingCart,
  BookOpen,
  Home,
  HeartPulse,
  MoreHorizontal,
} from 'lucide-react';

export const categoryConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  GENERAL_HELP: {
    label: 'General Help',
    icon: HelpCircle,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  TRANSPORTATION: {
    label: 'Transportation',
    icon: Car,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  TECHNOLOGY_SUPPORT: {
    label: 'Tech Support',
    icon: Monitor,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  SHOPPING_AND_ERRANDS: {
    label: 'Shopping & Errands',
    icon: ShoppingCart,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  TUTORING_AND_EDUCATION: {
    label: 'Education',
    icon: BookOpen,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  HOUSEHOLD_TASKS: {
    label: 'Household Tasks',
    icon: Home,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  HEALTHCARE_ASSISTANCE: {
    label: 'Healthcare',
    icon: HeartPulse,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  OTHERS: {
    label: 'Others',
    icon: MoreHorizontal,
    color: 'text-neutral-600',
    bg: 'bg-neutral-50',
  },
};

export function getCategoryConfig(category: string) {
  return categoryConfig[category] ?? categoryConfig.OTHERS;
}

export function CategoryIcon({
  category,
  size = 'sm',
}: {
  category: string;
  size?: 'sm' | 'md';
}) {
  const cfg = getCategoryConfig(category);
  const Icon = cfg.icon;
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconDim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className={`${dim} ${cfg.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon className={`${iconDim} ${cfg.color}`} />
    </div>
  );
}
