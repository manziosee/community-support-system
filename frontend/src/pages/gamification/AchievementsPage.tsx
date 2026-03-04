import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import { useGamification, LEVEL_THRESHOLDS, getLevelProgress, getNextLevelThreshold } from '../../contexts/GamificationContext';
import GamificationWidget from '../../components/gamification/GamificationWidget';
import AchievementBadges from '../../components/gamification/AchievementBadges';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { LevelBadge } from '../../components/common/BadgeDisplay';

const POINT_ACTIONS = [
  { action: 'Complete an assignment',      pts: '+40 pts', emoji: '✅' },
  { action: 'Receive a 5-star rating',     pts: '+20 pts', emoji: '⭐' },
  { action: 'Quick response (< 1hr)',      pts: '+15 pts', emoji: '⚡' },
  { action: 'Consecutive week active',     pts: '+25 pts', emoji: '🔥' },
  { action: 'Help 10 people in a month',   pts: '+50 pts', emoji: '🎯' },
  { action: 'First assignment',            pts: '+10 pts', emoji: '🌟' },
];

const AchievementsPage: React.FC = () => {
  const { profile, isLoading } = useGamification();

  if (isLoading) return <LoadingSpinner size="lg" text="Loading achievements…" />;

  if (!profile) {
    return (
      <div className="text-center py-16">
        <Trophy className="w-12 h-12 text-neutral-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-1">Achievements Coming Soon</h3>
        <p className="text-sm text-neutral-500 dark:text-slate-400">Complete assignments to start earning points and badges!</p>
      </div>
    );
  }

  const levelInfo = LEVEL_THRESHOLDS[profile.level];
  const progress  = getLevelProgress(profile.points, profile.level);
  const nextPts   = getNextLevelThreshold(profile.level);
  const remaining = Math.max(0, nextPts - profile.points);

  type LvKey = keyof typeof LEVEL_THRESHOLDS;
  const levelOrder: LvKey[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumb />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-400 to-primary-600 text-white shadow-soft-lg p-6 lg:p-8">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-6 h-6" />
            <h1 className="font-display text-2xl font-extrabold">My Achievements</h1>
          </div>
          <p className="text-white/70 text-sm mb-4">Track your progress, earn badges, and level up!</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Points',  value: profile.points.toLocaleString() },
              { label: 'Badges Earned', value: String(profile.badges.length) },
              { label: 'Hours Served',  value: `${profile.totalHoursServed ?? 0}h` },
              { label: 'Level',         value: `${levelInfo.icon} ${levelInfo.label}` },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-center">
                <p className="font-display font-black text-lg leading-none">{s.value}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Level Roadmap */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <h2 className="font-bold text-gray-900 dark:text-slate-100">Level Journey</h2>
            </div>
            <div className="flex items-center gap-2">
              {levelOrder.map((lv, idx) => {
                const info    = LEVEL_THRESHOLDS[lv];
                const reached = levelOrder.indexOf(profile.level) >= idx;
                const current = profile.level === lv;
                return (
                  <React.Fragment key={lv}>
                    <div className={`flex flex-col items-center gap-1.5 transition-transform ${current ? 'scale-110' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!reached ? 'opacity-40 grayscale' : ''} ${current ? 'ring-2 ring-primary-400 shadow-soft' : ''}`}>
                        <span className="text-2xl">{info.icon}</span>
                      </div>
                      <LevelBadge level={lv} size="sm" />
                    </div>
                    {idx < levelOrder.length - 1 && (
                      <div className={`flex-1 h-1.5 rounded-full ${reached && profile.level !== lv ? 'bg-gradient-to-r from-primary-400 to-secondary-400' : 'bg-neutral-200 dark:bg-slate-700'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {profile.level !== 'PLATINUM' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-neutral-500 dark:text-slate-400 mb-1.5">
                  <span>{profile.points.toLocaleString()} pts</span>
                  <span>{remaining.toLocaleString()} pts to {levelOrder[levelOrder.indexOf(profile.level) + 1]}</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Achievements & Badges */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5">
            <AchievementBadges />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <GamificationWidget />

          {/* How to Earn Points */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />
              How to Earn Points
            </h3>
            <div className="space-y-2.5">
              {POINT_ACTIONS.map((item) => (
                <div key={item.action} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">{item.emoji}</span>
                    <p className="text-xs text-neutral-600 dark:text-slate-400 truncate">{item.action}</p>
                  </div>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
