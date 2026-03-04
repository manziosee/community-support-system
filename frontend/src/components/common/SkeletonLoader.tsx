import React from 'react';

// ─── Base Skeleton ────────────────────────────────────────────────────────────
const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-neutral-200 dark:bg-slate-700 ${className}`}>
    <div className="absolute inset-0 shimmer" />
  </div>
);

// ─── Stat Card Skeleton ───────────────────────────────────────────────────────
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Bone className="h-3 w-24" />
      <Bone className="h-9 w-9 rounded-xl" />
    </div>
    <Bone className="h-8 w-16" />
    <Bone className="h-3 w-20" />
  </div>
);

// ─── List Item Skeleton ───────────────────────────────────────────────────────
export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-slate-700 rounded-xl">
    <Bone className="w-9 h-9 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Bone className="h-3.5 w-3/4" />
      <Bone className="h-3 w-1/2" />
    </div>
    <Bone className="h-6 w-16 rounded-full flex-shrink-0" />
  </div>
);

// ─── Dashboard Skeleton ───────────────────────────────────────────────────────
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Welcome Banner */}
    <Bone className="h-40 rounded-2xl" />

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
    </div>

    {/* Chart + List */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5 space-y-4">
        <Bone className="h-4 w-40" />
        <Bone className="h-48 rounded-xl" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5 space-y-3">
        <Bone className="h-4 w-36" />
        {[...Array(4)].map((_, i) => <ListItemSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

// ─── Card Skeleton ────────────────────────────────────────────────────────────
export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5 space-y-3">
    <Bone className="h-4 w-1/3" />
    {[...Array(rows)].map((_, i) => <ListItemSkeleton key={i} />)}
  </div>
);

// ─── Table Skeleton ───────────────────────────────────────────────────────────
export const TableSkeleton: React.FC<{ cols?: number; rows?: number }> = ({ cols = 5, rows = 6 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-neutral-100 dark:border-slate-700">
      {[...Array(cols)].map((_, i) => (
        <Bone key={i} className={`h-3 ${i === 0 ? 'flex-[2]' : 'flex-1'}`} />
      ))}
    </div>
    {/* Rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-neutral-50 dark:border-slate-800 last:border-0">
        {[...Array(cols)].map((_, j) => (
          <Bone key={j} className={`h-4 ${j === 0 ? 'flex-[2]' : 'flex-1'} ${j === 0 ? 'w-full' : ''}`} />
        ))}
      </div>
    ))}
  </div>
);

// ─── Profile Skeleton ─────────────────────────────────────────────────────────
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-5">
      <Bone className="w-20 h-20 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bone className="h-5 w-40" />
        <Bone className="h-3 w-28" />
        <Bone className="h-3 w-36" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
  </div>
);

// ─── Notification Skeleton ────────────────────────────────────────────────────
export const NotificationSkeleton: React.FC = () => (
  <div className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100 dark:border-slate-700">
    <Bone className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Bone className="h-3.5 w-full" />
      <Bone className="h-3 w-1/2" />
    </div>
  </div>
);

// ─── Leaderboard Skeleton ─────────────────────────────────────────────────────
export const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-neutral-100 dark:border-slate-700">
        <Bone className="w-8 h-8 rounded-full flex-shrink-0" />
        <Bone className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-3 w-20" />
        </div>
        <Bone className="h-6 w-16 rounded-full flex-shrink-0" />
        <Bone className="h-6 w-12 flex-shrink-0" />
      </div>
    ))}
  </div>
);

export default { Bone, StatCardSkeleton, ListItemSkeleton, DashboardSkeleton, CardSkeleton, TableSkeleton, ProfileSkeleton, NotificationSkeleton, LeaderboardSkeleton };
