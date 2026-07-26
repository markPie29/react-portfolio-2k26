import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { InquiryRow, InquiryStatus, BookingRow } from '../../types/database';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Mail,
  Phone,
  Building2,
  Globe,
  ExternalLink,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Inbox,
  Sparkles,
  ArrowUpDown,
  Filter,
  User,
  FileText
} from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Detail panel editing state
  const [editingStatus, setEditingStatus] = useState<InquiryStatus>('new');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingMeetingLink, setEditingMeetingLink] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const fetchInquiriesAndBookings = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      // Mock inquiries for preview mode
      const today = new Date();
      const mockTodayStr = today.toISOString().split('T')[0];

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const mockYesterdayStr = yesterday.toISOString().split('T')[0];

      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 3);
      const mockNextWeekStr = nextWeek.toISOString().split('T')[0];

      const mockInquiries: InquiryRow[] = [
        {
          id: 'inq-mock-1',
          full_name: 'Alex Vance',
          company: 'Nexus Tech Ltd.',
          email: 'alex@nexustech.io',
          phone: '+63 917 123 4567',
          website: 'nexustech.io',
          project_type: 'Software',
          description:
            'Looking to build a SaaS dashboard for managing internal operations and real-time inventory tracking with webhooks and live metrics.',
          status: 'new',
          notes: 'High priority lead from tech company.',
          created_at: `${mockTodayStr}T10:30:00.000Z`,
          updated_at: `${mockTodayStr}T10:30:00.000Z`,
        },
        {
          id: 'inq-mock-2',
          full_name: 'Sophia Martinez',
          company: 'Creative Studios',
          email: 'sophia@creativestudios.com',
          phone: '+63 918 987 6543',
          website: 'creativestudios.com',
          project_type: 'Graphic Design',
          description: 'Need a complete modern brand identity and motion graphic templates for our visual media brand.',
          status: 'confirmed',
          notes: 'Email confirmation sent. Discovery call scheduled.',
          created_at: `${mockYesterdayStr}T14:15:00.000Z`,
          updated_at: `${mockYesterdayStr}T14:15:00.000Z`,
        },
        {
          id: 'inq-mock-3',
          full_name: 'David Chen',
          company: 'Growth Digital',
          email: 'david@growthdigital.co',
          phone: null,
          website: null,
          project_type: 'Social Media',
          description: 'Monthly social graphics management and content template design across Instagram and LinkedIn.',
          status: 'cancelled',
          notes: 'Client cancelled request due to budget constraints.',
          created_at: `${mockNextWeekStr}T09:00:00.000Z`,
          updated_at: `${mockNextWeekStr}T09:00:00.000Z`,
        },
      ];

      const mockBookings: BookingRow[] = [
        {
          id: 'book-mock-2',
          inquiry_id: 'inq-mock-2',
          client_name: 'Sophia Martinez',
          client_email: 'sophia@creativestudios.com',
          booked_date: mockYesterdayStr,
          booked_time: '14:00',
          duration: 30,
          meeting_type: 'discovery',
          status: 'confirmed',
          meeting_link: 'https://meet.google.com/xyz-pdq-abc',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setInquiries(mockInquiries);
      setBookings(mockBookings);
      setSelectedInquiry(mockInquiries[0]);
      setIsLoading(false);
      return;
    }

    try {
      const [inqRes, bookRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*'),
      ]);

      if (inqRes.data) {
        setInquiries(inqRes.data);
        if (inqRes.data.length > 0 && !selectedInquiry) {
          setSelectedInquiry(inqRes.data[0]);
        }
      }
      if (bookRes.data) {
        setBookings(bookRes.data);
      }
    } catch (err) {
      console.error('Failed to load inquiries calendar data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiriesAndBookings();
  }, []);

  // When selected inquiry changes, update panel state
  useEffect(() => {
    if (selectedInquiry) {
      setEditingStatus(selectedInquiry.status);
      setEditingNotes(selectedInquiry.notes || '');

      // Find matching booking for meeting link
      const matchBooking = bookings.find((b) => b.inquiry_id === selectedInquiry.id);
      setEditingMeetingLink(matchBooking?.meeting_link || '');
      setSaveSuccess(false);
    }
  }, [selectedInquiry, bookings]);

  // Filtered list based on search & status pill
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.project_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Convert Sunday=0 to Monday-first (0=Mon...6=Sun)
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group filtered inquiries by YYYY-MM-DD date
  const inquiriesByDate: Record<string, InquiryRow[]> = {};
  filteredInquiries.forEach((inq) => {
    const dateStr = inq.created_at.split('T')[0];
    if (!inquiriesByDate[dateStr]) {
      inquiriesByDate[dateStr] = [];
    }
    inquiriesByDate[dateStr].push(inq);
  });

  const handleSaveDetails = async () => {
    if (!selectedInquiry) return;
    setIsSaving(true);
    setSaveSuccess(false);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('inquiries')
        .update({
          status: editingStatus,
          notes: editingNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedInquiry.id);

      if (error) {
        alert(`Failed to save: ${error.message}`);
        setIsSaving(false);
        return;
      }

      // If meeting link is specified, upsert into bookings table
      if (editingMeetingLink.trim()) {
        const existingBooking = bookings.find((b) => b.inquiry_id === selectedInquiry.id);
        if (existingBooking) {
          await supabase
            .from('bookings')
            .update({ meeting_link: editingMeetingLink.trim() })
            .eq('id', existingBooking.id);
        } else {
          await supabase.from('bookings').insert([
            {
              inquiry_id: selectedInquiry.id,
              client_name: selectedInquiry.full_name,
              client_email: selectedInquiry.email,
              booked_date: selectedInquiry.created_at.split('T')[0],
              booked_time: '10:00',
              meeting_type: 'discovery',
              status: editingStatus === 'cancelled' ? 'cancelled' : 'confirmed',
              meeting_link: editingMeetingLink.trim(),
            },
          ]);
        }
      }
    }

    const updated = {
      ...selectedInquiry,
      status: editingStatus,
      notes: editingNotes,
      updated_at: new Date().toISOString(),
    };

    setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedInquiry(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusBadge = (st: InquiryStatus) => {
    switch (st) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            New / Unreviewed
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Email Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Cancelled / No Show
          </span>
        );
    }
  };

  // Find linked booking for the active selected inquiry
  const activeBooking = selectedInquiry
    ? bookings.find((b) => b.inquiry_id === selectedInquiry.id)
    : null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 text-gray-100 min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 shrink-0">
        <div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-sky-400" />
            <span>Inquiries & Calendar Hub</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Visual calendar schedule for client project inquiries and call management.
          </p>
        </div>

        <button
          onClick={fetchInquiriesAndBookings}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Filter Pills with Color Legend */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-sky-500 border-sky-500 text-white shadow-md'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
            }`}
          >
            All ({inquiries.length})
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'new'
                ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:border-blue-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Blue: New</span>
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green: Confirmed</span>
          </button>

          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'cancelled'
                ? 'bg-red-500 border-red-500 text-white shadow-md'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Red: Cancelled</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Calendar | Right Detail Panel */}
      {isLoading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3 flex-1">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Inquiries Calendar...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* LEFT SIDE: Interactive Month Calendar (8 cols on desktop - larger view) */}
          <div className="lg:col-span-8 bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-neutralfacebold text-lg text-white">
                  {monthNames[month]} {year}
                </h2>
                <span className="text-xs text-gray-500 uppercase font-mono">
                  {filteredInquiries.length} Inquiries Total
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-xs font-semibold uppercase bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={prevMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs uppercase font-bold text-gray-400 py-2 border-y border-white/10">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading cells */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-20 rounded-xl bg-white/[0.02]" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                const dayInquiries = inquiriesByDate[dateStr] || [];
                const isToday = dateStr === todayStr;
                const isSelectedDate = dateStr === selectedDateStr;

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      setSelectedDateStr(dateStr);
                      if (dayInquiries.length > 0) {
                        setSelectedInquiry(dayInquiries[0]);
                      }
                    }}
                    className={`h-20 p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                      isSelectedDate
                        ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/40'
                        : isToday
                        ? 'bg-white/10 border-sky-400/50'
                        : dayInquiries.length > 0
                        ? 'bg-white/5 border-white/10 hover:border-sky-500/40'
                        : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {/* Day number & Today badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold font-mono ${
                          isToday
                            ? 'text-sky-400 font-neutralfacebold'
                            : 'text-gray-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </div>

                    {/* Inquiry status indicator dots */}
                    {dayInquiries.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap overflow-hidden pt-1">
                        {dayInquiries.map((inq) => {
                          const isCurrentSelected = selectedInquiry?.id === inq.id;
                          return (
                            <button
                              key={inq.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDateStr(dateStr);
                                setSelectedInquiry(inq);
                              }}
                              title={`${inq.full_name} (${inq.status})`}
                              className={`h-2.5 px-1 rounded-full text-[9px] font-bold uppercase transition-transform flex items-center ${
                                isCurrentSelected ? 'scale-110 ring-1 ring-white' : ''
                              } ${
                                inq.status === 'new'
                                  ? 'bg-blue-500 text-white'
                                  : inq.status === 'confirmed'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              <span className="truncate max-w-[40px] hidden sm:inline">
                                {inq.full_name.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* List of inquiries for selected date or overall matching inquiries list */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                {selectedDateStr ? `Inquiries on ${selectedDateStr}` : 'All Recent Inquiries'}
              </span>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {(selectedDateStr
                  ? filteredInquiries.filter((i) => i.created_at.startsWith(selectedDateStr))
                  : filteredInquiries
                ).map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500 text-white'
                          : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <div className="space-y-0.5 overflow-hidden pr-2">
                        <span className="font-semibold text-white block truncate">
                          {inq.full_name}
                        </span>
                        <span className="text-[11px] text-gray-400 block truncate">
                          {inq.project_type} • {inq.email}
                        </span>
                      </div>
                      <div className="shrink-0">{getStatusBadge(inq.status)}</div>
                    </div>
                  );
                })}

                {selectedDateStr &&
                  filteredInquiries.filter((i) => i.created_at.startsWith(selectedDateStr)).length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2 text-center">
                      No inquiries recorded on this date.
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Complete Inquiry Details & Action Panel (4 cols on desktop - compact panel) */}
          <div className="lg:col-span-4 bg-[#0c1017] border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl sticky top-6">
            {!selectedInquiry ? (
              <div className="py-28 text-center space-y-3">
                <Inbox className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="font-neutralfacebold text-base text-gray-300 uppercase">
                  No Inquiry Selected
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click any date or inquiry from the calendar view on the left to view complete client brief and manage status.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gray-400">
                        ID: {selectedInquiry.id}
                      </span>
                      <span>•</span>
                      <span className="text-[10px] font-mono text-sky-400">
                        {new Date(selectedInquiry.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h2 className="font-neutralfacebold text-xl uppercase text-white">
                      {selectedInquiry.full_name}
                    </h2>
                    {selectedInquiry.company && (
                      <p className="text-xs text-sky-400 font-medium">{selectedInquiry.company}</p>
                    )}
                  </div>

                  <div className="shrink-0">{getStatusBadge(selectedInquiry.status)}</div>
                </div>

                {/* Status Switcher Buttons */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Update Inquiry Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStatus('new')}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        editingStatus === 'new'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-2 ring-blue-500/40'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span>🔵 New</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingStatus('confirmed')}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        editingStatus === 'confirmed'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>🟢 Confirmed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingStatus('cancelled')}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        editingStatus === 'cancelled'
                          ? 'bg-red-500/20 border-red-500 text-red-300 ring-2 ring-red-500/40'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span>🔴 Cancelled</span>
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 text-xs">
                  <h4 className="font-neutralfacebold text-sky-400 uppercase tracking-wider text-[11px]">
                    Client Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                      <a href={`mailto:${selectedInquiry.email}`} className="hover:underline truncate font-mono">
                        {selectedInquiry.email}
                      </a>
                    </div>

                    {selectedInquiry.phone ? (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                        <a href={`tel:${selectedInquiry.phone}`} className="hover:underline font-mono">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                        <span>No phone provided</span>
                      </div>
                    )}

                    {selectedInquiry.company && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>{selectedInquiry.company}</span>
                      </div>
                    )}

                    {selectedInquiry.website ? (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Globe className="w-4 h-4 text-sky-500 shrink-0" />
                        <a
                          href={
                            selectedInquiry.website.startsWith('http')
                              ? selectedInquiry.website
                              : `https://${selectedInquiry.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline truncate flex items-center gap-1"
                        >
                          <span>{selectedInquiry.website}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                        <span>No website link</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Domain & Description Brief */}
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                      Type of Project
                    </span>
                    <span className="font-neutralfacebold text-base text-white block">
                      {selectedInquiry.project_type}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Project Description & Client Brief
                    </label>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
                      {selectedInquiry.description}
                    </div>
                  </div>
                </div>

                {/* Discovery Call Details (if linked booking exists) */}
                {activeBooking && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-neutralfacebold uppercase text-emerald-400 flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Scheduled Discovery Call</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold text-emerald-300">
                        {activeBooking.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-200">
                      <span>Date: <strong className="text-white">{activeBooking.booked_date}</strong></span>
                      <span>Time: <strong className="text-white">{activeBooking.booked_time}</strong></span>
                    </div>
                  </div>
                )}

                {/* Meeting Link Entry */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                    <span>Meeting Link (Google Meet / Zoom)</span>
                    {editingMeetingLink && (
                      <a
                        href={editingMeetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <div className="relative">
                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={editingMeetingLink}
                      onChange={(e) => setEditingMeetingLink(e.target.value)}
                      placeholder="e.g. https://meet.google.com/abc-defg-hij"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Admin Internal Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Admin Private Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add internal notes about pricing, client discussions, scope, or call outcomes..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y"
                  />
                </div>

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Regarding%20Your%20${encodeURIComponent(selectedInquiry.project_type)}%20Inquiry`}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Email Client</span>
                  </a>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveDetails}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Updates Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Updates</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
