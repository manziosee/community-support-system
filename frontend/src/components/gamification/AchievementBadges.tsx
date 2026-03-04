import React, { useState } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { ALL_BADGES } from '../../contexts/GamificationContext';
import { BadgeCard } from '../common/BadgeDisplay';
import type { VolunteerBadge } from '../../types';

const AchievementBadges: React.FC = () => {
  const { profile } = useGamification();
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges');

  const earnedIds  = new Set(profile?.badges.map((b) => b.badgeId) ?? []);
  const earnedBadges  = ALL_BADGES.filter((b) => earnedIds.has(b.badgeId));
  const lockedBadges  = ALL_BADGES.filter((b) => !earnedIds.has(b.badgeId));
  const achievements  = profile?.achievements ?? [];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {(['badges', 'achievements'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
                : 'text-neutral-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'badges' && (
        <div className="space-y-5">
          {earnedBadges.length > 0 && (
            <div>
              <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Earned ({earnedBadges.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {earnedBadges.map((b) => (
                  <BadgeCard key={b.badgeId} badge={b} size="sm" earned />
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <p className="text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Locked ({lockedBadges.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {lockedBadges.map((b) => (
                  <div key={b.badgeId} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800 opacity-50">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-slate-700 relative">
                      <span className="text-xl grayscale">{b.icon}</span>
                      <Lock className="absolute bottom-0.5 right-0.5 w-3 h-3 text-neutral-400" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-slate-400 text-center leading-tight">{b.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-3">
          {achievements.map((ach) => {
            const pct = Math.round((ach.progress / ach.target) * 100);
            const done = ach.progress >= ach.target;
            return (
              <div
                key={ach.achievementId}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  done
                    ? 'border-green-200 dark:border-green-700/40 bg-green-50 dark:bg-green-900/10'
                    : 'border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl flex-shrink-0 ${done ? 'bg-green-100 dark:bg-green-900/30' : 'bg-neutral-100 dark:bg-slate-700'}`}>
                  {done ? ach.icon : <Lock className="w-5 h-5 text-neutral-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-bold ${done ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-slate-100'}`}>{ach.name}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Trophy className={`w-3.5 h-3.5 ${done ? 'text-yellow-500' : 'text-neutral-400'}`} />
                      <span className={`text-xs font-bold ${done ? 'text-yellow-600 dark:text-yellow-400' : 'text-neutral-500 dark:text-slate-400'}`}>{ach.points} pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-slate-400 mb-2">{ach.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-green-500' : 'bg-primary-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 dark:text-slate-400 flex-shrink-0">
                      {ach.progress}/{ach.target}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
