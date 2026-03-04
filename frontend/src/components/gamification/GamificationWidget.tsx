import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Zap } from 'lucide-react';
import { useGamification, getLevelProgress, getNextLevelThreshold, LEVEL_THRESHOLDS } from '../../contexts/GamificationContext';
import { LevelBadge, BadgeRow } from '../common/BadgeDisplay';
import ProgressRing from '../dashboard/ProgressRing';

interface GamificationWidgetProps {
  compact?: boolean;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ compact = false }) => {
  const { profile, isLoading } = useGamification();

  if (isLoading || !profile) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-4 animate-pulse">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-slate-700 rounded mb-3" />
        <div className="h-8 w-16 bg-neutral-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-2 w-full bg-neutral-200 dark:bg-slate-700 rounded" />
      </div>
    );
  }

  const levelInfo = LEVEL_THRESHOLDS[profile.level];
  const progress  = getLevelProgress(profile.points, profile.level);
  const nextPts   = getNextLevelThreshold(profile.level);
  const remaining = Math.max(0, nextPts - profile.points);

  if (compact) {
    return (
      <Link to="/achievements">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-100 dark:border-primary-700/30 rounded-xl hover:shadow-soft transition-all duration-200 group">
          <div className="flex-shrink-0">
            <ProgressRing value={progress} size={44} strokeWidth={4} color="#009688" trackColor="rgba(0,150,136,0.15)" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-display font-black text-gray-900 dark:text-slate-100">{profile.points}</span>
              <span className="text-xs text-neutral-500 dark:text-slate-400">pts</span>
              <LevelBadge level={profile.level} size="sm" />
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-slate-600 group-hover:text-primary-400 flex-shrink-0" />
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <h3 className="font-display font-bold text-sm">My Progress</h3>
          </div>
          <LevelBadge level={profile.level} size="sm" />
        </div>

        <div className="flex items-center gap-4">
          <ProgressRing value={progress} size={72} strokeWidth={6} color="white" trackColor="rgba(255,255,255,0.2)" />
          <div>
            <p className="text-3xl font-display font-black leading-none">{profile.points.toLocaleString()}</p>
            <p className="text-primary-200 text-sm mt-0.5">Total Points</p>
            {profile.level !== 'PLATINUM' && (
              <p className="text-xs text-white/70 mt-1">{remaining} pts to {levelInfo.label !== 'PLATINUM' ? 'next level' : 'max level'}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>{levelInfo.label}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-neutral-100 dark:divide-slate-700 border-b border-neutral-100 dark:border-slate-700">
        {[
          { label: 'Weekly', value: profile.weeklyPoints ?? 0, icon: Zap, color: 'text-primary-600 dark:text-primary-400' },
          { label: 'Hours', value: profile.totalHoursServed ?? 0, icon: Trophy, color: 'text-secondary-600 dark:text-secondary-400' },
          { label: 'Badges', value: profile.badges.length, icon: Trophy, color: 'text-yellow-600 dark:text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="p-3 text-center">
            <p className={`text-xl font-display font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className="p-4">
          <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-3">Earned Badges</p>
          <BadgeRow badges={profile.badges} max={6} />
        </div>
      )}

      {/* Link */}
      <div className="px-4 pb-4">
        <Link
          to="/achievements"
          className="flex items-center justify-center gap-2 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-xl text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
        >
          View All Achievements <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default GamificationWidget;
