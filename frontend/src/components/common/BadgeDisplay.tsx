import React from 'react';
import type { VolunteerBadge } from '../../types';

// B&W rarity config — uses shade progression from light → pure black
const RARITY_CONFIG = {
  COMMON:    {
    border:     'border-gray-200 dark:border-slate-600',
    bg:         'bg-gray-50 dark:bg-slate-700/50',
    label:      'Common',
    labelColor: 'text-gray-400 dark:text-slate-500',
  },
  RARE:      {
    border:     'border-gray-400 dark:border-gray-500',
    bg:         'bg-gray-100 dark:bg-gray-800/50',
    label:      'Rare',
    labelColor: 'text-gray-600 dark:text-gray-400',
  },
  EPIC:      {
    border:     'border-gray-600 dark:border-gray-400',
    bg:         'bg-gray-200 dark:bg-gray-700/60',
    label:      'Epic',
    labelColor: 'text-gray-700 dark:text-gray-300',
  },
  LEGENDARY: {
    border:     'border-gray-900 dark:border-gray-200',
    bg:         'bg-gray-900 dark:bg-white',
    label:      'Legendary',
    labelColor: 'text-white dark:text-gray-900',
  },
};

interface BadgeCardProps {
  badge: VolunteerBadge;
  size?: 'sm' | 'md' | 'lg';
  earned?: boolean;
  showRarity?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, size = 'md', earned = true, showRarity = true }) => {
  const rarity    = RARITY_CONFIG[badge.rarity];
  const emojiSize = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }[size];
  const boxSize   = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28' }[size];
  const nameSize  = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size];
  const isLegendary = badge.rarity === 'LEGENDARY';

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${rarity.border} ${rarity.bg}
        transition-all duration-200 ${earned ? '' : 'opacity-40 grayscale'}
        hover:scale-105 hover:shadow-soft`}
      title={badge.description}
    >
      <div className={`${boxSize} flex items-center justify-center rounded-xl border ${rarity.border} bg-white dark:bg-slate-800 shadow-crisp`}>
        <span className={`${emojiSize} ${!earned ? 'grayscale' : ''}`}>{badge.icon}</span>
      </div>
      <div className="text-center">
        <p className={`font-bold leading-tight ${nameSize} ${isLegendary ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-slate-100'}`}>
          {badge.name}
        </p>
        {showRarity && (
          <span className={`text-[10px] font-bold uppercase tracking-wide ${rarity.labelColor}`}>
            {rarity.label}
          </span>
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
  const shown    = badges.slice(0, max);
  const extra    = badges.length - shown.length;
  const emojiSize = size === 'sm' ? 'text-lg' : 'text-2xl';
  const boxSize   = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {shown.map((b) => (
        <div
          key={b.badgeId}
          className={`${boxSize} flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-crisp`}
          title={`${b.name}: ${b.description}`}
        >
          <span className={emojiSize}>{b.icon}</span>
        </div>
      ))}
      {extra > 0 && (
        <div className={`${boxSize} flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600`}>
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400">+{extra}</span>
        </div>
      )}
    </div>
  );
};

// ─── Level Badge ──────────────────────────────────────────────────────────────
import type { VolunteerLevel } from '../../types';

// B&W levels — progression: light gray → mid gray → dark gray → pure black (inverted)
const LEVEL_STYLES: Record<VolunteerLevel, { bg: string; text: string; border: string; icon: string }> = {
  BRONZE:   { bg: 'bg-gray-100 dark:bg-gray-800',   text: 'text-gray-600 dark:text-gray-300',  border: 'border-gray-200 dark:border-gray-700', icon: '🥉' },
  SILVER:   { bg: 'bg-gray-200 dark:bg-gray-700',   text: 'text-gray-700 dark:text-gray-200',  border: 'border-gray-400 dark:border-gray-500', icon: '🥈' },
  GOLD:     { bg: 'bg-gray-800 dark:bg-gray-200',   text: 'text-white dark:text-gray-900',     border: 'border-gray-700 dark:border-gray-300', icon: '🥇' },
  PLATINUM: { bg: 'bg-black dark:bg-white',         text: 'text-white dark:text-gray-900',     border: 'border-gray-600 dark:border-gray-300', icon: '💎' },
};

export const LevelBadge: React.FC<{ level: VolunteerLevel; size?: 'sm' | 'md' | 'lg' }> = ({ level, size = 'md' }) => {
  const s  = LEVEL_STYLES[level];
  const px = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' }[size];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold ${s.bg} ${s.text} ${s.border} ${px}`}>
      <span>{s.icon}</span>
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
};

export default BadgeCard;
