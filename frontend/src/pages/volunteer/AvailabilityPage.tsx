import React, { useState } from 'react';
import { Calendar, Clock, Info, ToggleLeft, RefreshCw } from 'lucide-react';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import AvailabilityToggle from '../../components/common/AvailabilityToggle';
import Breadcrumb from '../../components/common/Breadcrumb';
import { HelpTooltip } from '../../components/common/Tooltip';
import type { AvailabilitySlot, VolunteerStatus } from '../../types';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const RECURRING_OPTIONS = [
  { id: 'weekly_groceries', label: 'Weekly Grocery Help', description: 'Every Saturday morning', icon: '🛒', days: 'Every Sat 9–12 AM' },
  { id: 'tutoring',         label: 'Tutoring Sessions',   description: 'Weekday evenings',        icon: '📚', days: 'Mon/Wed/Fri 6–8 PM' },
  { id: 'transport',        label: 'Transportation Help', description: 'Weekend mornings',         icon: '🚗', days: 'Sun 8–11 AM' },
  { id: 'general_support',  label: 'General Assistance',  description: 'Flexible schedule',        icon: '🤝', days: 'Tue/Thu 2–5 PM' },
];

const AvailabilityPage: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<VolunteerStatus>('ONLINE');
  const [savedSlots, setSavedSlots] = useState<AvailabilitySlot[]>([]);
  const [activeRecurring, setActiveRecurring] = useState<Set<string>>(new Set());

  const handleSave = (slots: AvailabilitySlot[]) => {
    setSavedSlots(slots);
    toast.success(t('availability_saved') + ' successfully!');
  };

  const toggleRecurring = (id: string) => {
    setActiveRecurring((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success('Recurring schedule removed');
      } else {
        next.add(id);
        toast.success('Recurring schedule activated! 🔁');
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Breadcrumb />

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-600 text-white shadow-soft-lg p-6">
        <div className="dot-grid absolute inset-0 opacity-[0.07]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <h1 className="font-display text-xl font-extrabold">{t('availability_title')}</h1>
            </div>
            <p className="text-secondary-200 text-sm">Set your schedule so citizens can find you when they need help.</p>
          </div>
          <div className="flex-shrink-0">
            <AvailabilityToggle initialStatus={status} onChange={setStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary-500" />
              <h2 className="font-bold text-gray-900 dark:text-slate-100">Weekly Schedule</h2>
              <HelpTooltip content="Set the hours each week you're available to help citizens. Recurring slots repeat every week." />
            </div>
            <AvailabilityCalendar onSave={handleSave} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ToggleLeft className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100">Current Status</h3>
            </div>
            <AvailabilityToggle initialStatus={status} onChange={setStatus} />
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your status is visible to citizens. Set to <strong>Online</strong> when you're ready to take new requests.
            </p>
          </div>

          {/* Recurring Templates */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100">Quick Schedules</h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mb-3">Activate pre-set recurring volunteering schedules.</p>
            <div className="space-y-2">
              {RECURRING_OPTIONS.map((opt) => {
                const active = activeRecurring.has(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleRecurring(opt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                      active
                        ? 'border-primary-300 dark:border-primary-600/50 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700/30'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${active ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-slate-100'}`}>{opt.label}</p>
                      <p className="text-[10px] text-neutral-500 dark:text-slate-400">{opt.days}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${active ? 'bg-primary-500 border-primary-500' : 'border-neutral-300 dark:border-slate-600'}`}>
                      {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 border border-secondary-100 dark:border-secondary-700/30 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-secondary-700 dark:text-secondary-400 mb-1">Pro Tip</p>
                <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
                  Volunteers with regular availability get 3× more assignment matches. Keep your calendar up to date!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
