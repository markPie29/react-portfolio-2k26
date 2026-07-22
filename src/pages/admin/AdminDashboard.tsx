import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { InquiryRow, BookingRow } from '../../types/database';
import { Inbox, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowRight, Sparkles, AlertCircle, FolderKanban } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!isSupabaseConfigured) {
        setInquiries([
          {
            id: 'inq-mock-1',
            full_name: 'Alex Vance',
            company: 'Nexus Tech Ltd.',
            email: 'alex@nexustech.io',
            phone: null,
            website: 'nexustech.io',
            services: ['Software Development'],
            budget: '₱50,000 – ₱100,000',
            timeline: 'Within 1 Month',
            project_type: 'New Project',
            feature_chips: ['Dashboard'],
            description: 'Building SaaS dashboard.',
            attachments: [],
            status: 'new',
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setBookings([]);
        setIsLoading(false);
        return;
      }

      try {
        const [inqRes, bookRes] = await Promise.all([
          supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('bookings').select('*').order('booked_date', { ascending: true }),
        ]);

        if (inqRes.data) setInquiries(inqRes.data);
        if (bookRes.data) setBookings(bookRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCalls = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-8 text-gray-100">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-sky-900/30 via-cyan-900/20 to-transparent border border-sky-500/20 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Hub</span>
          </div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white">
            Welcome back, Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Here is your current activity overview for project uploads, client inquiries & calls.
          </p>
        </div>

        <Link
          to="/admin/projects"
          className="px-5 py-2.5 rounded-xl gradient-bg hover:brightness-110 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0c1017] border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
              Total Inquiries
            </span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-neutralfacebold text-white">{totalInquiries}</p>
          <span className="text-[10px] text-gray-500 block">Submitted via public portfolio</span>
        </div>

        <div className="p-5 bg-[#0c1017] border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
              New Unreviewed
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-neutralfacebold text-amber-400">{newInquiries}</p>
          <span className="text-[10px] text-gray-500 block">Requires your review</span>
        </div>

        <div className="p-5 bg-[#0c1017] border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
              Scheduled Calls
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-neutralfacebold text-emerald-400">{confirmedBookings}</p>
          <span className="text-[10px] text-gray-500 block">Confirmed 1-on-1 discovery calls</span>
        </div>

        <div className="p-5 bg-[#0c1017] border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
              Completed Calls
            </span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-neutralfacebold text-sky-400">{completedCalls}</p>
          <span className="text-[10px] text-gray-500 block">Finished consultations</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/projects"
          className="p-6 bg-[#0c1017] border border-sky-500/30 hover:border-sky-400 rounded-2xl space-y-3 transition-all group shadow-lg"
        >
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
            <FolderKanban className="w-5 h-5" />
          </div>
          <h3 className="font-neutralfacebold text-base text-white group-hover:text-sky-400 transition-colors">
            Upload & Manage Projects →
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Add new portfolio projects, upload media assets to Supabase, set tech stack, and edit descriptions.
          </p>
        </Link>

        <Link
          to="/admin/inquiries"
          className="p-6 bg-[#0c1017] border border-white/10 hover:border-sky-500/40 rounded-2xl space-y-3 transition-all group"
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="font-neutralfacebold text-base text-white group-hover:text-sky-400 transition-colors">
            Manage Client Inquiries →
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review detailed project briefs, feature requests, budget constraints, and client uploads.
          </p>
        </Link>

        <Link
          to="/admin/calendar"
          className="p-6 bg-[#0c1017] border border-white/10 hover:border-sky-500/40 rounded-2xl space-y-3 transition-all group"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="font-neutralfacebold text-base text-white group-hover:text-sky-400 transition-colors">
            Calendar & Meeting Links →
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            View upcoming client calls and attach Google Meet / Zoom links manually.
          </p>
        </Link>

        <Link
          to="/admin/availability"
          className="p-6 bg-[#0c1017] border border-white/10 hover:border-sky-500/40 rounded-2xl space-y-3 transition-all group"
        >
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-neutralfacebold text-base text-white group-hover:text-sky-400 transition-colors">
            Set Availability Rules →
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Configure weekly recurring hours and specific date overrides for client booking options.
          </p>
        </Link>
      </div>

      {/* Recent Inquiries Activity */}
      <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-neutralfacebold text-sm text-white uppercase tracking-wider">
            Recent Client Inquiries
          </h2>
          <Link to="/admin/inquiries" className="text-xs text-sky-400 hover:underline font-semibold">
            View All ({totalInquiries})
          </Link>
        </div>

        {isLoading ? (
          <p className="text-xs text-gray-500 py-4 text-center">Loading recent activity...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">No inquiries submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inq) => (
              <div
                key={inq.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 text-xs hover:border-white/15 transition-colors"
              >
                <div>
                  <span className="font-semibold text-white block">{inq.full_name}</span>
                  <span className="text-[11px] text-gray-400 font-mono">{inq.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-400 block">{inq.budget}</span>
                  <span className="text-[10px] text-gray-500 uppercase">{inq.services[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
