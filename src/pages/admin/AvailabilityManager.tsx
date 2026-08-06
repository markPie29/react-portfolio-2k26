import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AvailabilitySlotRow } from '../../types/database';
import { Clock, Calendar as CalendarIcon, Save, Plus, Trash2, CheckCircle2, Loader2, Ban } from 'lucide-react';

const DAYS_MAP = [
  { day: 1, label: 'Monday' },
  { day: 2, label: 'Tuesday' },
  { day: 3, label: 'Wednesday' },
  { day: 4, label: 'Thursday' },
  { day: 5, label: 'Friday' },
  { day: 6, label: 'Saturday' },
  { day: 0, label: 'Sunday' },
];

const format12Hour = (time24: string) => {
  if (!time24) return '';
  const parts = time24.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  if (isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
};

export const AvailabilityManager: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlotRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Specific date hours override state
  const [overrideDate, setOverrideDate] = useState<string>('');
  const [overrideStart, setOverrideStart] = useState<string>('09:00');
  const [overrideEnd, setOverrideEnd] = useState<string>('17:00');

  // Quick Action Block a Date state
  const [blockDate, setBlockDate] = useState<string>('');

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
    setSlots((prev) => [...prev.filter((s) => s.specific_date !== overrideDate), newSlot]);
    setOverrideDate('');
  };

  const handleAddBlockDate = async () => {
    if (!blockDate) return;
    const newSlot: AvailabilitySlotRow = {
      id: `slot-block-${blockDate}`,
      day_of_week: null,
      specific_date: blockDate,
      start_time: '00:00:00',
      end_time: '00:00:00',
      slot_duration: 30,
      is_active: true,
      created_at: '',
    };
    setSlots((prev) => [...prev.filter((s) => s.specific_date !== blockDate), newSlot]);
    setBlockDate('');
  };

  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    if (isSupabaseConfigured) {
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

  const customHoursOverrides = slots.filter(
    (s) => s.specific_date && s.start_time !== s.end_time
  );

  const blockedDates = slots.filter(
    (s) => s.specific_date && s.start_time === s.end_time
  );

  return (
    <div className="space-y-6 text-gray-100 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="font-neutralfacebold text-xl uppercase tracking-tight text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-sky-400" />
            <span>Availability Rules</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage weekly recurring schedule, custom hours, and blocked dates.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
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
        /* 2-Column Responsive Dashboard Layout */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Weekly Recurring Schedule (7 cols on XL) */}
          <div className="xl:col-span-7 bg-[#0c1017] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="font-neutralfacebold text-xs text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
              <CalendarIcon className="w-4 h-4 text-sky-400" />
              <span>Weekly Recurring Schedule</span>
            </h2>

            <div className="space-y-3">
              {DAYS_MAP.map((d) => {
                const slot = slots.find((s) => s.day_of_week === d.day);
                const isActive = slot ? slot.is_active : false;

                return (
                  <div
                    key={d.day}
                    className={`p-3.5 rounded-xl border text-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-white/5 border-sky-500/30'
                        : 'bg-white/5 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleToggleDay(d.day)}
                        className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                      />
                      <span className="font-neutralfacebold text-sm text-white">
                        {d.label}
                      </span>
                    </div>

                    {isActive && slot ? (
                      <div className="flex flex-col gap-2 md:items-start">
                        {/* Top Row: 12-Hour Preview Badge */}
                        <div className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-sans font-semibold flex items-center gap-1.5 w-fit">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          <span>
                            {format12Hour(slot.start_time)} – {format12Hour(slot.end_time)}
                          </span>
                        </div>

                        {/* Bottom Row: Start, End, and Slot Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px] font-sans font-bold uppercase tracking-wider">START:</span>
                            <div className="relative flex items-center">
                              <input
                                type="time"
                                value={slot.start_time.substring(0, 5)}
                                onChange={(e) =>
                                  handleTimeChange(d.day, 'start_time', `${e.target.value}:00`)
                                }
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                className="px-2.5 py-1 pr-7 bg-white/5 border border-white/15 rounded-lg text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                              />
                              <Clock className="w-3.5 h-3.5 text-white absolute right-2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px] font-sans font-bold uppercase tracking-wider">END:</span>
                            <div className="relative flex items-center">
                              <input
                                type="time"
                                value={slot.end_time.substring(0, 5)}
                                onChange={(e) =>
                                  handleTimeChange(d.day, 'end_time', `${e.target.value}:00`)
                                }
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                className="px-2.5 py-1 pr-7 bg-white/5 border border-white/15 rounded-lg text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                              />
                              <Clock className="w-3.5 h-3.5 text-white absolute right-2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px] font-sans font-bold uppercase tracking-wider">SLOT:</span>
                            <select
                              value={slot.slot_duration || 30}
                              onChange={(e) =>
                                handleTimeChange(d.day, 'slot_duration', parseInt(e.target.value, 10))
                              }
                              className="px-2.5 py-1 bg-white/5 border border-white/15 rounded-lg text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                            >
                              <option value={15} className="bg-[#0c1017] font-sans">15 m</option>
                              <option value={30} className="bg-[#0c1017] font-sans">30 m</option>
                              <option value={45} className="bg-[#0c1017] font-sans">45 m</option>
                              <option value={60} className="bg-[#0c1017] font-sans">60 m</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 italic font-sans">Off</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Quick Actions (Block Date & Custom Overrides) (5 cols on XL) */}
          <div className="xl:col-span-5 space-y-5">

            {/* Quick Action: Block Entire Date */}
            <div className="bg-[#120b10] border border-rose-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                <h2 className="font-neutralfacebold text-xs text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span>Block Date</span>
                </h2>
                <span className="text-[10px] text-rose-400/80 font-sans">Mark Entire Day Off</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 pr-9 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans cursor-pointer"
                  />
                  <CalendarIcon className="w-4 h-4 text-white absolute right-3 pointer-events-none" />
                </div>
                <button
                  onClick={handleAddBlockDate}
                  disabled={!blockDate}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block</span>
                </button>
              </div>

              {/* List of Blocked Dates */}
              {blockedDates.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400/80 block">
                    Blocked Dates ({blockedDates.length})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {blockedDates.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span className="font-semibold text-white font-sans">{s.specific_date}</span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-sans">
                            Unavailable
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteSlot(s.id)}
                          className="p-1 text-gray-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Unblock date"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Date Hours Override */}
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h2 className="font-neutralfacebold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-sky-400" />
                  <span>Custom Date Hours</span>
                </h2>
                <span className="text-[10px] text-gray-400 font-sans">Override Specific Date</span>
              </div>

              <div className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={overrideDate}
                    onChange={(e) => setOverrideDate(e.target.value)}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full px-3 py-2 pr-9 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans cursor-pointer"
                  />
                  <CalendarIcon className="w-4 h-4 text-white absolute right-3 pointer-events-none" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Start:</span>
                    <div className="relative flex items-center flex-1">
                      <input
                        type="time"
                        value={overrideStart}
                        onChange={(e) => setOverrideStart(e.target.value)}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                        className="w-full px-2.5 py-1.5 pr-7 bg-white/5 border border-white/15 rounded-xl text-xs text-white font-sans focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      />
                      <Clock className="w-3.5 h-3.5 text-white absolute right-2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">End:</span>
                    <div className="relative flex items-center flex-1">
                      <input
                        type="time"
                        value={overrideEnd}
                        onChange={(e) => setOverrideEnd(e.target.value)}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                        className="w-full px-2.5 py-1.5 pr-7 bg-white/5 border border-white/15 rounded-xl text-xs text-white font-sans focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      />
                      <Clock className="w-3.5 h-3.5 text-white absolute right-2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    onClick={handleAddOverrideDate}
                    disabled={!overrideDate}
                    className="px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* List of Custom Hours Overrides */}
              {customHoursOverrides.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Custom Date Hours ({customHoursOverrides.length})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {customHoursOverrides.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
                          <span className="font-semibold text-white font-sans">{s.specific_date}</span>
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-sans">
                            {format12Hour(s.start_time)} – {format12Hour(s.end_time)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteSlot(s.id)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete override"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
