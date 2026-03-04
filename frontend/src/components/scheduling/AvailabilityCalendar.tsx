import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Check } from 'lucide-react';
import type { AvailabilitySlot } from '../../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function fmtHour(h: number) {
  if (h === 0)  return '12 AM';
  if (h < 12)  return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const INITIAL_SLOTS: AvailabilitySlot[] = [
  { slotId: '1', dayOfWeek: 1, startHour: 9,  endHour: 12, isRecurring: true },
  { slotId: '2', dayOfWeek: 3, startHour: 14, endHour: 18, isRecurring: true },
  { slotId: '3', dayOfWeek: 6, startHour: 8,  endHour: 14, isRecurring: true },
];

interface AvailabilityCalendarProps {
  readOnly?: boolean;
  onSave?: (slots: AvailabilitySlot[]) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ readOnly = false, onSave }) => {
  const [slots, setSlots]   = useState<AvailabilitySlot[]>(INITIAL_SLOTS);
  const [saved, setSaved]   = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft]   = useState<{ day: number; start: number; end: number }>({ day: 1, start: 9, end: 17 });

  const addSlot = () => {
    if (draft.start >= draft.end) return;
    const newSlot: AvailabilitySlot = {
      slotId: generateId(),
      dayOfWeek: draft.day,
      startHour: draft.start,
      endHour: draft.end,
      isRecurring: true,
    };
    setSlots((p) => [...p, newSlot]);
    setAdding(false);
    setSaved(false);
  };

  const removeSlot = (id: string) => {
    setSlots((p) => p.filter((s) => s.slotId !== id));
    setSaved(false);
  };

  const handleSave = () => {
    onSave?.(slots);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Group slots by day for rendering
  const slotsByDay: Record<number, AvailabilitySlot[]> = {};
  for (const s of slots) {
    if (!slotsByDay[s.dayOfWeek]) slotsByDay[s.dayOfWeek] = [];
    slotsByDay[s.dayOfWeek].push(s);
  }

  // Determine grid height (18 hours shown 6am-12am)
  const VISIBLE_HOURS = HOURS.slice(6, 24); // 6am to midnight

  return (
    <div className="space-y-4">
      {/* Weekly Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-neutral-100 dark:border-slate-700 bg-neutral-50 dark:bg-slate-900/50">
          <div className="p-3 text-xs font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide">Time</div>
          {DAYS.map((d, i) => (
            <div key={d} className={`p-3 text-center text-xs font-bold uppercase tracking-wide ${slotsByDay[i] ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-slate-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="overflow-y-auto max-h-72">
          {VISIBLE_HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-neutral-50 dark:border-slate-800/50 min-h-[32px]">
              <div className="px-3 py-1 text-xs text-neutral-400 dark:text-slate-500 flex-shrink-0 border-r border-neutral-100 dark:border-slate-700">
                {fmtHour(hour)}
              </div>
              {DAYS.map((_, dayIdx) => {
                const covered = slots.some((s) => s.dayOfWeek === dayIdx && hour >= s.startHour && hour < s.endHour);
                const isStart = slots.some((s) => s.dayOfWeek === dayIdx && hour === s.startHour);
                const slot    = slots.find((s)  => s.dayOfWeek === dayIdx && hour === s.startHour);
                return (
                  <div key={dayIdx} className={`border-r border-neutral-50 dark:border-slate-800/50 relative ${covered ? 'bg-primary-100 dark:bg-primary-900/30' : ''}`}>
                    {isStart && slot && (
                      <div className="absolute inset-x-0.5 top-0.5 bg-primary-500 text-white text-[9px] font-bold px-1 py-0.5 rounded flex items-center justify-between">
                        <span>{fmtHour(slot.startHour)}-{fmtHour(slot.endHour)}</span>
                        {!readOnly && (
                          <button onClick={() => removeSlot(slot.slotId)} className="ml-1 hover:text-red-200">
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Current Slots List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-200 dark:border-slate-700/60 p-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">Recurring Availability</h4>
        {slots.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-slate-400 text-center py-4">No availability slots set</p>
        ) : (
          <div className="space-y-2">
            {slots.map((s) => (
              <div key={s.slotId} className="flex items-center justify-between p-2.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400 w-8">{DAYS[s.dayOfWeek]}</span>
                  <span className="text-xs text-neutral-600 dark:text-slate-400">{fmtHour(s.startHour)} → {fmtHour(s.endHour)}</span>
                  <span className="text-xs text-neutral-400 dark:text-slate-500">({s.endHour - s.startHour}h)</span>
                </div>
                {!readOnly && (
                  <button onClick={() => removeSlot(s.slotId)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Slot */}
        {!readOnly && (
          <div className="mt-3">
            {adding ? (
              <div className="border border-primary-200 dark:border-primary-700/40 rounded-xl p-3 space-y-3 bg-primary-50/50 dark:bg-primary-900/10">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 mb-1 block">Day</label>
                    <select
                      value={draft.day}
                      onChange={(e) => setDraft((p) => ({ ...p, day: +e.target.value }))}
                      className="w-full text-xs border border-neutral-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    >
                      {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 mb-1 block">From</label>
                    <select
                      value={draft.start}
                      onChange={(e) => setDraft((p) => ({ ...p, start: +e.target.value }))}
                      className="w-full text-xs border border-neutral-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    >
                      {HOURS.slice(6, 22).map((h) => <option key={h} value={h}>{fmtHour(h)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-500 dark:text-slate-400 mb-1 block">To</label>
                    <select
                      value={draft.end}
                      onChange={(e) => setDraft((p) => ({ ...p, end: +e.target.value }))}
                      className="w-full text-xs border border-neutral-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    >
                      {HOURS.slice(7, 24).map((h) => <option key={h} value={h}>{fmtHour(h)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addSlot} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition-colors">
                    <Check className="w-3.5 h-3.5" />Add Slot
                  </button>
                  <button onClick={() => setAdding(false)} className="px-3 py-2 border border-neutral-200 dark:border-slate-600 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-primary-200 dark:border-primary-700/40 text-primary-600 dark:text-primary-400 rounded-xl text-sm font-semibold hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <Plus className="w-4 h-4" />Add Availability Slot
              </button>
            )}
          </div>
        )}
      </div>

      {/* Save */}
      {!readOnly && (
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-soft'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" />Saved!</> : 'Save Availability'}
        </button>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
