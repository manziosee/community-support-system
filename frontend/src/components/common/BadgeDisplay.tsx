import React from 'react';
import type { VolunteerBadge } from '../../types';

const RARITY_CONFIG = {
  COMMON:    { border: 'border-neutral-300 dark:border-slate-600',   bg: 'bg-neutral-50 dark:bg-slate-700/50',         label: 'Common',    labelColor: 'text-neutral-500 dark:text-slate-400' },
  RARE:      { border: 'border-blue-300 dark:border-blue-600/50',    bg: 'bg-blue-50 dark:bg-blue-900/20',             label: 'Rare',      labelColor: 'text-blue-600 dark:text-blue-400' },
  EPIC:      { border: 'border-purple-300 dark:border-purple-600/50', bg: 'bg-purple-50 dark:bg-purple-900/20',         label: 'Epic',      labelColor: 'text-purple-600 dark:text-purple-400' },
  LEGENDARY: { border: 'border-yellow-400 dark:border-yellow-500/50', bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20', label: 'Legendary', labelColor: 'text-yellow-600 dark:text-yellow-400' },
};

interface BadgeCardProps {
  badge: VolunteerBadge;
  size?: 'sm' | 'md' | 'lg';
  earned?: boolean;
  showRarity?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, size = 'md', earned = true, showRarity = true }) => {
  const rarity = RARITY_CONFIG[badge.rarity];
  const emojiSize = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }[size];
  const boxSize   = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28' }[size];
  const nameSize  = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${rarity.border} ${rarity.bg} transition-all duration-200 ${earned ? '' : 'opacity-40 grayscale'} hover:scale-105 hover:shadow-soft`}
      title={badge.description}
    >
      <div className={`${boxSize} flex items-center justify-center rounded-xl border ${rarity.border} bg-white dark:bg-slate-800 shadow-sm`}>
        <span className={`${emojiSize} ${!earned ? 'grayscale' : ''}`}>{badge.icon}</span>
      </div>
      <div className="text-center">
        <p className={`font-bold text-gray-900 dark:text-slate-100 leading-tight ${nameSize}`}>{badge.name}</p>
        {showRarity && (
          <span className={`text-[10px] font-bold uppercase tracking-wide ${rarity.labelColor}`}>{rarity.label}</span>
        )}
      </div>
    </div>
  );
};

// ─── Inline Badge Row ─────────────────────────────────────────────────────────
interface BadgeRowProps {
  badges: VolunteerBadge[];
  max?: number;
  size?: 'sm' | 'md';
}

export const BadgeRow: React.FC<BadgeRowProps> = ({ badges, max = 5, size = 'sm' }) => {
  const shown = badges.slice(0, max);
  const extra = badges.length - shown.length;
  const emojiSize = size === 'sm' ? 'text-lg' : 'text-2xl';
  const boxSize   = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {shown.map((b) => (
        <div key={b.badgeId} className={`${boxSize} flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 shadow-sm`} title={`${b.name}: ${b.description}`}>
          <span className={emojiSize}>{b.icon}</span>
        </div>
      ))}
      {extra > 0 && (
        <div className={`${boxSize} flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-slate-700 border border-neutral-200 dark:border-slate-600`}>
          <span className="text-xs font-bold text-neutral-500 dark:text-slate-400">+{extra}</span>
        </div>
      )}
    </div>
  );
};

// ─── Level Badge ──────────────────────────────────────────────────────────────
import type { VolunteerLevel } from '../../types';

const LEVEL_STYLES: Record<VolunteerLevel, { bg: string; text: string; border: string; icon: string }> = {
  BRONZE:   { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-700/40', icon: '🥉' },
  SILVER:   { bg: 'bg-slate-100 dark:bg-slate-700',       text: 'text-slate-600 dark:text-slate-300',   border: 'border-slate-200 dark:border-slate-600',       icon: '🥈' },
  GOLD:     { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-700/40', icon: '🥇' },
  PLATINUM: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-700/40', icon: '💎' },
};

export const LevelBadge: React.FC<{ level: VolunteerLevel; size?: 'sm' | 'md' | 'lg' }> = ({ level, size = 'md' }) => {
  const s = LEVEL_STYLES[level];
  const px = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' }[size];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold ${s.bg} ${s.text} ${s.border} ${px}`}>
      <span>{s.icon}</span>
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
};

export default BadgeCard;
