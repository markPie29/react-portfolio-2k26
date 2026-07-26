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
  Video,
  Inbox,
  ArrowUpDown,
  X,
  Clock
} from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal & Selection State
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expandedDayDateStr, setExpandedDayDateStr] = useState<string | null>(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Detail modal editing state
  const [editingStatus, setEditingStatus] = useState<InquiryStatus>('new');
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingMeetingLink, setEditingMeetingLink] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaveSuccessModalOpen, setIsSaveSuccessModalOpen] = useState<boolean>(false);

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
          id: 'inq-mock-1b',
          full_name: 'Marcus Sterling',
          company: 'Apex Logistics',
          email: 'marcus@apexlogistics.com',
          phone: '+63 919 444 5555',
          website: 'apexlogistics.com',
          project_type: 'Web Application',
          description:
            'Need a comprehensive real-time fleet dispatching management portal with interactive maps, automated driver assignment algorithms, custom role permissions, and full API integration with legacy ERP software. The UI should feature dark mode and high contrast metrics display.',
          status: 'new',
          notes: 'Enterprise account request.',
          created_at: `${mockTodayStr}T11:45:00.000Z`,
          updated_at: `${mockTodayStr}T11:45:00.000Z`,
        },
        {
          id: 'inq-mock-1c',
          full_name: 'Elena Rostova',
          company: 'Luxe Fashion Co.',
          email: 'elena@luxefashion.fr',
          phone: '+33 1 42 68 55 00',
          website: 'luxefashion.fr',
          project_type: 'UI/UX Design',
          description:
            'Seeking a sleek minimalist web design overhaul for high-end boutique e-commerce showcase.',
          status: 'new',
          notes: 'Referred by previous client.',
          created_at: `${mockTodayStr}T15:20:00.000Z`,
          updated_at: `${mockTodayStr}T15:20:00.000Z`,
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
          status: 'new',
          notes: 'Email confirmation pending. Discovery call requested.',
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
          id: 'book-mock-1',
          inquiry_id: 'inq-mock-1',
          client_name: 'Alex Vance',
          client_email: 'alex@nexustech.io',
          booked_date: mockTodayStr,
          booked_time: '11:00',
          duration: 30,
          meeting_type: 'discovery',
          status: 'new',
          meeting_link: 'https://meet.google.com/alex-vance-discovery',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'book-mock-2',
          inquiry_id: 'inq-mock-2',
          client_name: 'Sophia Martinez',
          client_email: 'sophia@creativestudios.com',
          booked_date: mockYesterdayStr,
          booked_time: '14:00',
          duration: 30,
          meeting_type: 'discovery',
          status: 'new',
          meeting_link: 'https://meet.google.com/xyz-pdq-abc',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setInquiries(mockInquiries);
      setBookings(mockBookings);
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

  // When selected inquiry changes, update editing state
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

  const openInquiryModal = (inquiry: InquiryRow) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  // Filtered list based on search & status filter
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

    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('inquiries')
        .update({
          status: editingStatus,
          notes: editingNotes,
          updated_at: nowIso,
        })
        .eq('id', selectedInquiry.id);

      if (error) {
        alert(`Failed to save: ${error.message}`);
        setIsSaving(false);
        return;
      }

      // Update or insert matching booking status & meeting link in Supabase
      const existingBooking = bookings.find((b) => b.inquiry_id === selectedInquiry.id);
      if (existingBooking) {
        await supabase
          .from('bookings')
          .update({
            status: editingStatus,
            meeting_link: editingMeetingLink.trim() || null,
            updated_at: nowIso,
          })
          .eq('id', existingBooking.id);
      } else if (editingMeetingLink.trim()) {
        await supabase.from('bookings').insert([
          {
            inquiry_id: selectedInquiry.id,
            client_name: selectedInquiry.full_name,
            client_email: selectedInquiry.email,
            booked_date: selectedInquiry.created_at.split('T')[0],
            booked_time: '10:00',
            meeting_type: 'discovery',
            status: editingStatus,
            meeting_link: editingMeetingLink.trim(),
          },
        ]);
      }
    }

    // Update local state for inquiry
    const updatedInquiry = {
      ...selectedInquiry,
      status: editingStatus,
      notes: editingNotes,
      updated_at: nowIso,
    };

    setInquiries((prev) => prev.map((item) => (item.id === updatedInquiry.id ? updatedInquiry : item)));
    setSelectedInquiry(updatedInquiry);

    // Update local state for bookings
    setBookings((prev) => {
      const exists = prev.some((b) => b.inquiry_id === selectedInquiry.id);
      if (exists) {
        return prev.map((b) =>
          b.inquiry_id === selectedInquiry.id
            ? {
                ...b,
                status: editingStatus,
                meeting_link: editingMeetingLink.trim() || b.meeting_link,
                updated_at: nowIso,
              }
            : b
        );
      } else if (editingMeetingLink.trim()) {
        const newBooking: BookingRow = {
          id: `book-local-${Date.now()}`,
          inquiry_id: selectedInquiry.id,
          client_name: selectedInquiry.full_name,
          client_email: selectedInquiry.email,
          booked_date: selectedInquiry.created_at.split('T')[0],
          booked_time: '10:00',
          duration: 30,
          meeting_type: 'discovery',
          status: editingStatus,
          meeting_link: editingMeetingLink.trim(),
          notes: null,
          created_at: nowIso,
          updated_at: nowIso,
        };
        return [...prev, newBooking];
      }
      return prev;
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setIsSaveSuccessModalOpen(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusBadge = (st: InquiryStatus) => {
    switch (st) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            New / Unreviewed
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Email Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase inline-flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Cancelled / No Show
          </span>
        );
    }
  };

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
            Full-width schedule view for client project inquiries. Click any date or inquiry item to view details in a modal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInquiriesAndBookings}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0">
        {/* Search Input */}
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
            }`}
          >
            All ({inquiries.length})
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              statusFilter === 'new'
                ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:border-blue-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>New</span>
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Confirmed</span>
          </button>

          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              statusFilter === 'cancelled'
                ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Cancelled</span>
          </button>
        </div>
      </div>

      {/* Main Full-Width Calendar Section */}
      {isLoading ? (
        <div className="py-32 text-center flex flex-col items-center justify-center gap-3 flex-1">
          <Loader2 className="w-9 h-9 text-sky-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Calendar Hub...</span>
        </div>
      ) : (
        <div className="space-y-6 flex-1 flex flex-col">
          {/* Calendar Card */}
          <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl space-y-6 w-full">
            {/* Calendar Month Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-neutralfacebold text-xl md:text-2xl text-white tracking-wide">
                  {monthNames[month]} <span className="text-sky-400">{year}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Showing {filteredInquiries.length} matching inquiries this period.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={goToToday}
                  className="px-4 py-2 text-xs font-semibold uppercase bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={prevMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-200 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs uppercase font-bold text-gray-400 py-2 border-b border-white/10">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Month Days Grid - Expanded Larger Height */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {/* Empty leading cells */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="min-h-[110px] md:min-h-[125px] rounded-2xl bg-white/[0.015] border border-white/[0.02]" />
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
                        setExpandedDayDateStr(dateStr);
                      }
                    }}
                    className={`min-h-[110px] md:min-h-[125px] p-2.5 md:p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                      isSelectedDate
                        ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/10'
                        : isToday
                        ? 'bg-white/10 border-sky-400/50 shadow-md shadow-sky-400/5'
                        : dayInquiries.length > 0
                        ? 'bg-white/5 border-white/10 hover:border-sky-500/40 hover:bg-white/[0.07]'
                        : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/15'
                    }`}
                  >
                    {/* Top Row: Day Number & Inquiries Count Badge */}
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs md:text-sm font-bold font-mono ${
                          isToday
                            ? 'text-sky-400 font-neutralfacebold'
                            : 'text-gray-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[9px] font-bold uppercase tracking-wider">
                            Today
                          </span>
                        )}
                        {dayInquiries.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold">
                            {dayInquiries.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Inquiry Badges inside the Day Cell - max 2 shown */}
                    <div className="space-y-1.5 my-1 overflow-y-auto max-h-[70px] scrollbar-none">
                      {dayInquiries.slice(0, 2).map((inq) => (
                        <button
                          key={inq.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDateStr(dateStr);
                            openInquiryModal(inq);
                          }}
                          title={`Click to view details for ${inq.full_name}`}
                          className={`w-full text-left p-1.5 rounded-lg border text-[11px] font-medium transition-all hover:scale-[1.02] flex items-center justify-between gap-1 cursor-pointer ${
                            inq.status === 'new'
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30'
                              : inq.status === 'confirmed'
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 border-red-500/40 text-red-200 hover:bg-red-500/30'
                          }`}
                        >
                          <span className="truncate font-semibold text-[11px]">
                            {inq.full_name}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            inq.status === 'new'
                              ? 'bg-blue-400 animate-pulse'
                              : inq.status === 'confirmed'
                              ? 'bg-emerald-400'
                              : 'bg-red-400'
                          }`} />
                        </button>
                      ))}

                      {dayInquiries.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDateStr(dateStr);
                            setExpandedDayDateStr(dateStr);
                          }}
                          className="w-full text-center py-1 px-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          + {dayInquiries.length - 2} more...
                        </button>
                      )}
                    </div>

                    {/* Bottom hint if cell has no inquiries */}
                    {dayInquiries.length === 0 && (
                      <span className="text-[10px] text-gray-600 font-mono self-start">
                        No events
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily List Panel Beneath Calendar */}
          <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-neutralfacebold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>
                    {selectedDateStr
                      ? `Inquiries for ${selectedDateStr}`
                      : 'All Recent Inquiries'}
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  {selectedDateStr
                    ? 'Showing inquiries recorded on this selected calendar date.'
                    : 'Showing all active inquiries. Click any date above to filter.'}
                </p>
              </div>

              {selectedDateStr && (
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-sky-400 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  Show All Dates
                </button>
              )}
            </div>

            {/* List items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(selectedDateStr
                ? filteredInquiries.filter((i) => i.created_at.startsWith(selectedDateStr))
                : filteredInquiries
              ).map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => openInquiryModal(inq)}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-sky-500/40 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-neutralfacebold text-sm text-white group-hover:text-sky-300 transition-colors">
                        {inq.full_name}
                      </h4>
                      {inq.company && (
                        <p className="text-xs text-sky-400 font-medium">{inq.company}</p>
                      )}
                    </div>
                    {getStatusBadge(inq.status)}
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {inq.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-2.5">
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">
                      {inq.project_type}
                    </span>
                    <span className="text-sky-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>View Brief</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}

              {(selectedDateStr
                ? filteredInquiries.filter((i) => i.created_at.startsWith(selectedDateStr))
                : filteredInquiries
              ).length === 0 && (
                <div className="col-span-full py-10 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-400">
                    No inquiries recorded for this view or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPANDED DAY VIEW MODAL OVERLAY                                           */}
      {/* ========================================================================= */}
      {expandedDayDateStr && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setExpandedDayDateStr(null)}
        >
          <div
            className="bg-[#0c1017] border border-white/15 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto modal-scrollbar relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-neutralfacebold text-xl uppercase text-white flex items-center gap-2.5">
                  <CalendarIcon className="w-5 h-5 text-sky-400" />
                  <span>Inquiries for {expandedDayDateStr}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {(inquiriesByDate[expandedDayDateStr] || []).length} client inquiry(ies) logged on this date. Click any item to view its brief.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpandedDayDateStr(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(inquiriesByDate[expandedDayDateStr] || []).map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => {
                    openInquiryModal(inq);
                  }}
                  className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-sky-500/40 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-neutralfacebold text-sm text-white group-hover:text-sky-300 transition-colors">
                        {inq.full_name}
                      </h4>
                      {inq.company && (
                        <p className="text-xs text-sky-400 font-medium">{inq.company}</p>
                      )}
                    </div>
                    {getStatusBadge(inq.status)}
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {inq.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-2.5">
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">
                      {inq.project_type}
                    </span>
                    <span className="text-sky-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>View Full Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}

              {(inquiriesByDate[expandedDayDateStr] || []).length === 0 && (
                <div className="col-span-full py-10 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-400">No inquiries for this specific date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INQUIRY DETAIL MODAL OVERLAY (LANDSCAPE MODE)                              */}
      {/* ========================================================================= */}
      {isModalOpen && selectedInquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="bg-[#0c1017] border border-white/15 rounded-3xl max-w-5xl md:max-w-6xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[88vh] overflow-y-auto modal-scrollbar relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-gray-400">
                    ID: {selectedInquiry.id}
                  </span>
                  <span className="text-gray-600">•</span>
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
                <h2 className="font-neutralfacebold text-2xl uppercase text-white">
                  {selectedInquiry.full_name}
                </h2>
                {selectedInquiry.company && (
                  <p className="text-xs text-sky-400 font-semibold mt-0.5">{selectedInquiry.company}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedInquiry.status)}
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Landscape Grid Body: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Client Contact Info & Project Brief */}
              <div className="space-y-5">
                {/* Client Contact Info List */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 text-xs">
                  <h4 className="font-neutralfacebold text-sky-400 uppercase tracking-wider text-[11px]">
                    Client Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-gray-400 font-semibold text-[10px] uppercase w-14">Email:</span>
                      <a href={`mailto:${selectedInquiry.email}`} className="hover:underline truncate font-mono text-white">
                        {selectedInquiry.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-gray-400 font-semibold text-[10px] uppercase w-14">Phone:</span>
                      {selectedInquiry.phone ? (
                        <a href={`tel:${selectedInquiry.phone}`} className="hover:underline font-mono text-white">
                          {selectedInquiry.phone}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-gray-400 font-semibold text-[10px] uppercase w-14">Company:</span>
                      {selectedInquiry.company ? (
                        <span className="text-white truncate">{selectedInquiry.company}</span>
                      ) : (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Globe className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="text-gray-400 font-semibold text-[10px] uppercase w-14">Website:</span>
                      {selectedInquiry.website ? (
                        <a
                          href={
                            selectedInquiry.website.startsWith('http')
                              ? selectedInquiry.website
                              : `https://${selectedInquiry.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline truncate text-sky-400 flex items-center gap-1"
                        >
                          <span className="truncate">{selectedInquiry.website}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Domain & Scrollable Project Description Brief */}
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      Project Domain
                    </span>
                    <span className="font-neutralfacebold text-sm text-white px-3 py-1 bg-white/10 rounded-lg">
                      {selectedInquiry.project_type}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Project Description & Client Brief
                    </label>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto modal-scrollbar">
                      {selectedInquiry.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Status Actions, Call Details, Meeting Link & Notes */}
              <div className="space-y-5">
                {/* Quick Status Updater */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Update Inquiry Status
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setEditingStatus('new')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        editingStatus === 'new'
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                          : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>New / Unreviewed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingStatus('confirmed')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        editingStatus === 'confirmed'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>Confirmed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingStatus('cancelled')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        editingStatus === 'cancelled'
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>Cancelled</span>
                    </button>
                  </div>
                </div>

                {/* Discovery Call Details */}
                {activeBooking && (() => {
                  const getCallStyles = (st: InquiryStatus) => {
                    switch (st) {
                      case 'new':
                        return {
                          box: 'bg-blue-500/10 border-blue-500/30',
                          title: 'text-blue-400',
                          badge: 'text-blue-300 bg-blue-500/20 border-blue-500/30',
                          label: 'New / Unreviewed',
                        };
                      case 'confirmed':
                        return {
                          box: 'bg-emerald-500/10 border-emerald-500/30',
                          title: 'text-emerald-400',
                          badge: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
                          label: 'Confirmed',
                        };
                      case 'cancelled':
                        return {
                          box: 'bg-red-500/10 border-red-500/30',
                          title: 'text-red-400',
                          badge: 'text-red-300 bg-red-500/20 border-red-500/30',
                          label: 'Cancelled',
                        };
                    }
                  };
                  const callStyle = getCallStyles(editingStatus);
                  return (
                    <div className={`p-4 ${callStyle.box} border rounded-2xl space-y-2 text-xs transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-neutralfacebold uppercase ${callStyle.title} flex items-center gap-1.5`}>
                          <CalendarIcon className="w-4 h-4" />
                          <span>Scheduled Discovery Call</span>
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${callStyle.badge}`}>
                          {callStyle.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-200">
                        <span>Date: <strong className="text-white">{activeBooking.booked_date}</strong></span>
                        <span>Time: <strong className="text-white">{activeBooking.booked_time}</strong></span>
                      </div>
                    </div>
                  );
                })()}

                {/* Meeting Link Field */}
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
                    rows={4}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add internal notes about pricing, client discussions, scope, or call outcomes..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y max-h-40 overflow-y-auto modal-scrollbar"
                  />
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Regarding%20Your%20${encodeURIComponent(selectedInquiry.project_type)}%20Inquiry`}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Email Client</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer flex-1 sm:flex-initial"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveDetails}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50 flex-1 sm:flex-initial"
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
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SAVE SUCCESS MODAL OVERLAY                                                */}
      {/* ========================================================================= */}
      {isSaveSuccessModalOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSaveSuccessModalOpen(false)}
        >
          <div
            className="bg-[#0c1017] border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-5 text-center relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-neutralfacebold text-xl uppercase text-white tracking-wide">
                Updates Saved Successfully!
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                The inquiry status, scheduled discovery call details, meeting link, and private notes have been updated in the database.
              </p>
            </div>

            {selectedInquiry && (
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Client Name:</span>
                  <span className="font-semibold text-white">{selectedInquiry.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Inquiry & Call Status:</span>
                  <span className="font-bold uppercase text-emerald-400">{editingStatus}</span>
                </div>
                {editingMeetingLink && (
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Meeting Link:</span>
                    <span className="font-mono text-sky-400 truncate max-w-[180px]">{editingMeetingLink}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSaveSuccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              Done & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
