import React, { useState } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import type { VolunteerStatus } from '../../types';

const STATUS_CONFIG: Record<VolunteerStatus, {
  label: string;
  icon: React.ElementType;
  dot: string;
  bg: string;
  text: string;
  border: string;
  pulse: boolean;
}> = {
  ONLINE:  { label: 'Online',  icon: Wifi,    dot: 'bg-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',  text: 'text-green-700 dark:text-green-400',  border: 'border-green-200 dark:border-green-700/40',  pulse: true  },
  BUSY:    { label: 'Busy',    icon: Clock,   dot: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20',text: 'text-orange-700 dark:text-orange-400',border: 'border-orange-200 dark:border-orange-700/40', pulse: false },
  OFFLINE: { label: 'Offline', icon: WifiOff, dot: 'bg-neutral-400',bg: 'bg-neutral-50 dark:bg-slate-800',  text: 'text-neutral-600 dark:text-slate-400',border: 'border-neutral-200 dark:border-slate-600',   pulse: false },
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

  const cfg = STATUS_CONFIG[status];
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
        className={`flex items-center gap-2 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-200 hover:shadow-sm ${compact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
      >
        <span className="relative flex-shrink-0">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} block`} />
          {cfg.pulse && (
            <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-60`} />
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
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-soft-lg border border-neutral-100 dark:border-slate-700 py-1.5 w-40 animate-pop">
          {STATUS_ORDER.map((s) => {
            const c = STATUS_CONFIG[s];
            const SIcon = c.icon;
            return (
              <button
                key={s}
                type="button"
                onClick={() => select(s)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-slate-700 ${s === status ? 'font-bold' : 'font-medium'}`}
              >
                <span className="relative flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full ${c.dot} block`} />
                  {c.pulse && s === status && (
                    <span className={`absolute inset-0 rounded-full ${c.dot} animate-ping opacity-60`} />
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
      {cfg.pulse && <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-60`} />}
    </span>
  );
};

export default AvailabilityToggle;
