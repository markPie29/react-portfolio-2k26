import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { BookingRow, BookingStatus } from '../../types/database';
import { Calendar as CalendarIcon, Clock, User, Mail, Video, CheckCircle2, XCircle, ExternalLink, Loader2, ArrowUpDown } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingMeetingLinkId, setEditingMeetingLinkId] = useState<string | null>(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState<string>('');

  const fetchBookings = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      const mockBookings: BookingRow[] = [
        {
          id: 'book-mock-1',
          inquiry_id: 'inq-mock-2',
          client_name: 'Sophia Martinez',
          client_email: 'sophia@creativestudios.com',
          booked_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          booked_time: '14:00',
          duration: 30,
          meeting_type: 'discovery',
          status: 'confirmed',
          meeting_link: 'https://meet.google.com/xyz-pdq-abc',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setBookings(mockBookings);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booked_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    if (isSupabaseConfigured) {
      await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleSaveMeetingLink = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase
        .from('bookings')
        .update({ meeting_link: meetingLinkInput.trim() })
        .eq('id', id);
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, meeting_link: meetingLinkInput.trim() } : b))
    );
    setEditingMeetingLinkId(null);
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  return (
    <div className="space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-sky-400" />
            <span>Discovery Call Bookings</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage client 1-on-1 scheduled calls & manual meeting links.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {['all', 'confirmed', 'completed', 'cancelled', 'no-show'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === st
                ? 'bg-sky-500 border-sky-500 text-white shadow-md'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Bookings List / Cards */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Bookings...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
          <CalendarIcon className="w-10 h-10 text-gray-500 mx-auto" />
          <p className="text-sm font-semibold text-gray-300">No discovery call bookings found</p>
          <p className="text-xs text-gray-500">
            Client bookings will automatically appear here when scheduled.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-[#0c1017] border border-white/10 rounded-2xl space-y-4 shadow-lg hover:border-sky-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-neutralfacebold text-sm text-white">{b.client_name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{b.client_email}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : b.status === 'completed'
                      ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Date & Time info */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-sky-400" />
                  <span className="font-medium text-white">
                    {new Date(b.booked_date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sky-300 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{b.booked_time}</span>
                </div>
              </div>

              {/* Meeting Link Section */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Meeting Link (Google Meet / Zoom)
                </span>
                {editingMeetingLinkId === b.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={meetingLinkInput}
                      onChange={(e) => setMeetingLinkInput(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      onClick={() => handleSaveMeetingLink(b.id)}
                      className="px-3 py-2 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-400 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10">
                    {b.meeting_link ? (
                      <a
                        href={b.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline truncate flex items-center gap-1 font-medium"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{b.meeting_link}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    ) : (
                      <span className="text-gray-500 italic text-[11px]">No link attached yet</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingMeetingLinkId(b.id);
                        setMeetingLinkInput(b.meeting_link || '');
                      }}
                      className="text-[10px] font-bold text-sky-400 hover:text-sky-300 uppercase underline ml-2 shrink-0 cursor-pointer"
                    >
                      {b.meeting_link ? 'Edit' : '+ Add Link'}
                    </button>
                  </div>
                )}
              </div>

              {/* Action status toggles */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2 text-xs">
                {b.status !== 'completed' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'completed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mark Completed</span>
                  </button>
                )}
                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Cancel Call</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
