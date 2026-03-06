import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Award, Crown } from 'lucide-react';
import { useGamification, LEVEL_THRESHOLDS } from '../../contexts/GamificationContext';
import { LevelBadge, BadgeRow } from '../../components/common/BadgeDisplay';
import { RatingDisplay } from '../../components/common/StarRating';
import { LeaderboardSkeleton } from '../../components/common/SkeletonLoader';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { LeaderboardEntry } from '../../types';
import { useTranslation } from 'react-i18next';

type Period = 'weekly' | 'monthly' | 'allTime';

const PERIOD_LABELS: Record<Period, string> = {
  weekly: 'This Week',
  monthly: 'This Month',
  allTime: 'All Time',
};

function getPodiumColor(rank: number) {
  if (rank === 1) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-600/40', icon: '🥇', text: 'text-yellow-700 dark:text-yellow-400', ring: 'ring-yellow-300 dark:ring-yellow-600' };
  if (rank === 2) return { bg: 'bg-slate-100 dark:bg-slate-700',      border: 'border-slate-300 dark:border-slate-500',       icon: '🥈', text: 'text-slate-600 dark:text-slate-300', ring: 'ring-slate-300 dark:ring-slate-500' };
  return            { bg: 'bg-orange-100 dark:bg-orange-900/30',      border: 'border-orange-300 dark:border-orange-600/40',  icon: '🥉', text: 'text-orange-700 dark:text-orange-400', ring: 'ring-orange-300 dark:ring-orange-600' };
}

const PodiumCard: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  const colors = getPodiumColor(entry.rank);
  const levelInfo = LEVEL_THRESHOLDS[entry.level];
  const height = entry.rank === 1 ? 'h-28' : entry.rank === 2 ? 'h-20' : 'h-14';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar */}
      <div className={`relative w-16 h-16 rounded-full ring-4 ${colors.ring} bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-soft-lg ${entry.rank === 1 ? 'w-20 h-20' : ''}`}>
        <span className={`text-white font-display font-black ${entry.rank === 1 ? 'text-2xl' : 'text-xl'}`}>
          {entry.user.name.charAt(0).toUpperCase()}
        </span>
        <span className={`absolute -top-2 -right-1 text-xl ${entry.rank === 1 ? 'text-2xl -top-3' : ''}`}>{colors.icon}</span>
      </div>

      {/* Info */}
      <div className="text-center">
        <p className={`font-bold text-gray-900 dark:text-slate-100 truncate max-w-[100px] ${entry.rank === 1 ? 'text-base' : 'text-sm'}`}>
          {entry.user.name.split(' ')[0]}
        </p>
        <LevelBadge level={entry.level} size="sm" />
      </div>

      {/* Points */}
      <p className={`font-display font-black ${colors.text} ${entry.rank === 1 ? 'text-xl' : 'text-base'}`}>
        {entry.points.toLocaleString()} pts
      </p>

      {/* Podium base */}
      <div className={`${height} w-24 ${colors.bg} border-t-4 ${colors.border} rounded-t-xl flex items-center justify-center`}>
        <span className={`font-display font-black text-3xl ${colors.text}`}>{entry.rank}</span>
      </div>
    </div>
  );
};

const LeaderboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { leaderboard, isLoading } = useGamification();
  const [period, setPeriod] = useState<Period>('allTime');

  const top3    = leaderboard.slice(0, 3);
  const rest    = leaderboard.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumb />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-primary-600 text-white shadow-soft-lg p-6 lg:p-8">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold">Community Leaderboard</h1>
              <p className="text-white/70 text-sm">Celebrating our top volunteers 🏆</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  period === p
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          {/* Podium */}
          {top3.length >= 3 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700/60 p-6">
              <h2 className="text-sm font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest text-center mb-6">Top 3 Heroes</h2>
              <div className="flex items-end justify-center gap-4">
                {podiumOrder.map((e) => <PodiumCard key={e.rank} entry={e} />)}
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-200 dark:border-slate-700/60 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <h2 className="font-bold text-gray-900 dark:text-slate-100">Rankings</h2>
              </div>
              <span className="text-xs text-neutral-500 dark:text-slate-400">{leaderboard.length} volunteers</span>
            </div>

            <div className="divide-y divide-neutral-50 dark:divide-slate-800">
              {leaderboard.map((entry, idx) => {
                const isTop3 = entry.rank <= 3;
                const rankIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

                return (
                  <div
                    key={entry.user.userId}
                    className={`flex items-center gap-4 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-slate-700/50 ${isTop3 ? 'bg-gradient-to-r from-yellow-50/60 to-transparent dark:from-yellow-900/5' : ''}`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {isTop3 ? (
                        <span className="text-xl">{rankIcons[entry.rank]}</span>
                      ) : (
                        <span className="text-sm font-bold text-neutral-400 dark:text-slate-500">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-600 shadow-sm ${isTop3 ? 'ring-2 ring-yellow-300 dark:ring-yellow-600/40' : ''}`}>
                      <span className="text-white font-bold">{entry.user.name.charAt(0).toUpperCase()}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{entry.user.name}</p>
                        <LevelBadge level={entry.level} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-neutral-500 dark:text-slate-400">{entry.user.location?.province ?? ''}</span>
                        {entry.badges.length > 0 && <BadgeRow badges={entry.badges} max={3} size="sm" />}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden sm:block text-center">
                        <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{entry.completedAssignments}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-slate-500">Tasks</p>
                      </div>
                      {entry.averageRating && (
                        <div className="hidden md:flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-gray-900 dark:text-slate-100">{entry.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-sm font-display font-black text-primary-600 dark:text-primary-400">{entry.points.toLocaleString()}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-slate-500">points</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
