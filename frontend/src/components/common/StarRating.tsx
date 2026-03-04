import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

const LABELS = ['Terrible', 'Bad', 'OK', 'Good', 'Excellent'];

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  showLabel = false,
  className = '',
}) => {
  const [hovered, setHovered] = useState(0);

  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const gapMap  = { sm: 'gap-0.5', md: 'gap-1', lg: 'gap-1.5' };
  const starSize = sizeMap[size];
  const gap      = gapMap[size];

  const active = hovered || value;

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {[...Array(max)].map((_, i) => {
        const starVal = i + 1;
        const filled  = starVal <= active;
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(starVal)}
            onMouseEnter={() => !readonly && setHovered(starVal)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125 active:scale-110'} focus:outline-none`}
            aria-label={`Rate ${starVal} out of ${max}`}
          >
            <Star
              className={`${starSize} transition-colors duration-150 ${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-neutral-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}

      {showLabel && active > 0 && (
        <span className="ml-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
          {LABELS[(active - 1)] ?? ''}
        </span>
      )}
    </div>
  );
};

// ─── Average Rating Display ───────────────────────────────────────────────────
export const RatingDisplay: React.FC<{ rating: number; count?: number; size?: 'sm' | 'md' | 'lg' }> = ({
  rating,
  count,
  size = 'sm',
}) => (
  <div className="flex items-center gap-1.5">
    <StarRating value={Math.round(rating)} readonly size={size} />
    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{rating.toFixed(1)}</span>
    {count !== undefined && (
      <span className="text-xs text-neutral-500 dark:text-slate-400">({count})</span>
    )}
  </div>
);

export default StarRating;
