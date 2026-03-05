import React, { useState } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import type { VolunteerStatus } from '../../types';

// B&W status config — distinguishes by shade density, not hue
const STATUS_CONFIG: Record<VolunteerStatus, {
  label: string;
  icon: React.ElementType;
  dot: string;
  bg: string;
  text: string;
  border: string;
  pulse: boolean;
}> = {
  ONLINE:  {
    label:  'Online',
    icon:   Wifi,
    dot:    'bg-gray-900 dark:bg-white',
    bg:     'bg-gray-900/5 dark:bg-white/10',
    text:   'text-gray-900 dark:text-white',
    border: 'border-gray-900/20 dark:border-white/20',
    pulse:  true,
  },
  BUSY:    {
    label:  'Busy',
    icon:   Clock,
    dot:    'bg-gray-500',
    bg:     'bg-gray-100 dark:bg-gray-700/50',
    text:   'text-gray-600 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    pulse:  false,
  },
  OFFLINE: {
    label:  'Offline',
    icon:   WifiOff,
    dot:    'bg-gray-300 dark:bg-gray-600',
    bg:     'bg-gray-50 dark:bg-slate-800/50',
    text:   'text-gray-400 dark:text-slate-500',
    border: 'border-gray-200 dark:border-slate-600',
    pulse:  false,
  },
};

const STATUS_ORDER: VolunteerStatus[] = ['ONLINE', 'BUSY', 'OFFLINE'];

interface AvailabilityToggleProps {
  initialStatus?: VolunteerStatus;
  onChange?: (status: VolunteerStatus) => void;
  compact?: boolean;
}

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  initialStatus = 'ONLINE',
  onChange,
  compact = false,
}) => {
  const [status, setStatus] = useState<VolunteerStatus>(() => {
    const stored = localStorage.getItem('volunteer-status') as VolunteerStatus | null;
    return stored ?? initialStatus;
  });
  const [open, setOpen] = useState(false);

  const cfg  = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  const select = (s: VolunteerStatus) => {
    setStatus(s);
    localStorage.setItem('volunteer-status', s);
    onChange?.(s);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 rounded-xl border ${cfg.border} ${cfg.bg}
          transition-all duration-200 hover:shadow-crisp ${compact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
      >
        <span className="relative flex-shrink-0">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} block`} />
          {cfg.pulse && (
            <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-50`} />
          )}
        </span>
        {!compact && (
          <>
            <Icon className={`w-3.5 h-3.5 ${cfg.text} flex-shrink-0`} />
            <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-gray-100 dark:border-slate-700 py-1.5 w-40 animate-pop">
          {STATUS_ORDER.map((s) => {
            const c     = STATUS_CONFIG[s];
            const SIcon = c.icon;
            return (
              <button
                key={s}
                type="button"
                onClick={() => select(s)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                  hover:bg-gray-50 dark:hover:bg-slate-700
                  ${s === status ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-slate-300'}`}
              >
                <span className="relative flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full ${c.dot} block`} />
                  {c.pulse && s === status && (
                    <span className={`absolute inset-0 rounded-full ${c.dot} animate-ping opacity-50`} />
                  )}
                </span>
                <SIcon className={`w-4 h-4 ${c.text} flex-shrink-0`} />
                <span className={c.text}>{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Inline Status Dot ────────────────────────────────────────────────────────
export const StatusDot: React.FC<{ status: VolunteerStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status];
  const sz  = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  return (
    <span className="relative inline-flex flex-shrink-0" title={cfg.label}>
      <span className={`${sz} rounded-full ${cfg.dot} block`} />
      {cfg.pulse && <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-50`} />}
    </span>
  );
};

export default AvailabilityToggle;
