import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AvailabilitySlotRow } from '../../types/database';
import { Clock, Calendar as CalendarIcon, Save, Plus, Trash2, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

const DAYS_MAP = [
  { day: 1, label: 'Monday' },
  { day: 2, label: 'Tuesday' },
  { day: 3, label: 'Wednesday' },
  { day: 4, label: 'Thursday' },
  { day: 5, label: 'Friday' },
  { day: 6, label: 'Saturday' },
  { day: 0, label: 'Sunday' },
];

export const AvailabilityManager: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlotRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New specific date block state
  const [overrideDate, setOverrideDate] = useState<string>('');
  const [overrideStart, setOverrideStart] = useState<string>('09:00');
  const [overrideEnd, setOverrideEnd] = useState<string>('17:00');

  const fetchSlots = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      // Mock recurring Monday-Friday 9am-5pm slots
      const mockSlots: AvailabilitySlotRow[] = DAYS_MAP.slice(0, 5).map((d, idx) => ({
        id: `slot-mock-${idx}`,
        day_of_week: d.day,
        specific_date: null,
        start_time: '09:00:00',
        end_time: '17:00:00',
        slot_duration: 30,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
      setSlots(mockSlots);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .order('day_of_week', { ascending: true });

      if (error) {
        console.error('Error fetching slots:', error);
      } else {
        setSlots(data || []);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleToggleDay = (dayOfWeek: number) => {
    const existing = slots.find((s) => s.day_of_week === dayOfWeek);
    if (existing) {
      setSlots((prev) =>
        prev.map((s) => (s.day_of_week === dayOfWeek ? { ...s, is_active: !s.is_active } : s))
      );
    } else {
      const uniqueId = `slot-new-day-${dayOfWeek}`;
      const newSlot: AvailabilitySlotRow = {
        id: uniqueId,
        day_of_week: dayOfWeek,
        specific_date: null,
        start_time: '09:00:00',
        end_time: '17:00:00',
        slot_duration: 30,
        is_active: true,
        created_at: '',
      };
      setSlots((prev) => [...prev, newSlot]);
    }
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'start_time' | 'end_time' | 'slot_duration',
    value: any
  ) => {
    setSlots((prev) =>
      prev.map((s) => (s.day_of_week === dayOfWeek ? { ...s, [field]: value } : s))
    );
  };

  const handleAddOverrideDate = async () => {
    if (!overrideDate) return;
    const newSlot: AvailabilitySlotRow = {
      id: `slot-override-${overrideDate}`,
      day_of_week: null,
      specific_date: overrideDate,
      start_time: `${overrideStart}:00`,
      end_time: `${overrideEnd}:00`,
      slot_duration: 30,
      is_active: true,
      created_at: '',
    };
    setSlots((prev) => [...prev, newSlot]);
    setOverrideDate('');
  };

  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    if (isSupabaseConfigured) {
      // Clear and re-upsert active slots
      const preparePayload = slots.map((s) => ({
        day_of_week: s.day_of_week,
        specific_date: s.specific_date,
        start_time: s.start_time.length === 5 ? `${s.start_time}:00` : s.start_time,
        end_time: s.end_time.length === 5 ? `${s.end_time}:00` : s.end_time,
        slot_duration: s.slot_duration || 30,
        is_active: s.is_active,
      }));

      await supabase.from('availability_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('availability_slots').insert(preparePayload);

      if (error) {
        alert(`Failed to save rules: ${error.message}`);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-gray-100 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-sky-400" />
            <span>Availability Rules</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure weekly recurring schedule and custom working hours for client bookings.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Rules Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Rules...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Weekly Recurring Days Manager */}
          <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="font-neutralfacebold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-sky-400" />
              <span>Weekly Recurring Schedule</span>
            </h2>

            <div className="space-y-4">
              {DAYS_MAP.map((d) => {
                const slot = slots.find((s) => s.day_of_week === d.day);
                const isActive = slot ? slot.is_active : false;

                return (
                  <div
                    key={d.day}
                    className={`p-4 rounded-xl border text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-white/5 border-sky-500/30'
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleToggleDay(d.day)}
                        className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                      />
                      <span className="font-neutralfacebold text-sm text-white w-24">
                        {d.label}
                      </span>
                    </div>

                    {isActive && slot ? (
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Start:</span>
                          <input
                            type="time"
                            value={slot.start_time.substring(0, 5)}
                            onChange={(e) =>
                              handleTimeChange(d.day, 'start_time', `${e.target.value}:00`)
                            }
                            className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[10px] uppercase font-bold">End:</span>
                          <input
                            type="time"
                            value={slot.end_time.substring(0, 5)}
                            onChange={(e) =>
                              handleTimeChange(d.day, 'end_time', `${e.target.value}:00`)
                            }
                            className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Duration:</span>
                          <select
                            value={slot.slot_duration || 30}
                            onChange={(e) =>
                              handleTimeChange(d.day, 'slot_duration', parseInt(e.target.value, 10))
                            }
                            className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                          >
                            <option value={15} className="bg-[#0c1017]">15 min</option>
                            <option value={30} className="bg-[#0c1017]">30 min</option>
                            <option value={45} className="bg-[#0c1017]">45 min</option>
                            <option value={60} className="bg-[#0c1017]">60 min</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specific Date Overrides */}
          <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-neutralfacebold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-sky-400" />
              <span>Specific Date Hours / Overrides</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <input
                type="date"
                value={overrideDate}
                onChange={(e) => setOverrideDate(e.target.value)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="time"
                  value={overrideStart}
                  onChange={(e) => setOverrideStart(e.target.value)}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white font-mono"
                />
                <span>to</span>
                <input
                  type="time"
                  value={overrideEnd}
                  onChange={(e) => setOverrideEnd(e.target.value)}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white font-mono"
                />
              </div>
              <button
                onClick={handleAddOverrideDate}
                disabled={!overrideDate}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Override Date</span>
              </button>
            </div>

            {/* List of active overrides */}
            {slots.filter((s) => s.specific_date).length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Active Specific Date Overrides
                </span>
                {slots
                  .filter((s) => s.specific_date)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold text-white">{s.specific_date}</span>
                        <span className="text-gray-400 font-mono">
                          {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
