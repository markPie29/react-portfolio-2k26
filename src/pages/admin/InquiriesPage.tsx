import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { InquiryRow, InquiryStatus } from '../../types/database';
import { InquiryDetailPanel } from './InquiryDetailPanel';
import { Search, Inbox, Filter, Loader2, ArrowUpDown, Eye } from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRow | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      // Mock data for preview mode
      const mockInquiries: InquiryRow[] = [
        {
          id: 'inq-mock-1',
          full_name: 'Alex Vance',
          company: 'Nexus Tech Ltd.',
          email: 'alex@nexustech.io',
          phone: '+63 917 123 4567',
          website: 'nexustech.io',
          services: ['Software Development', 'UI/UX'],
          budget: '₱50,000 – ₱100,000',
          timeline: 'Within 1 Month',
          project_type: 'New Project',
          feature_chips: ['Dashboard', 'Authentication', 'Analytics'],
          description:
            'Looking to build a SaaS dashboard for managing internal operations and real-time inventory tracking.',
          attachments: [
            { name: 'Architecture_Brief.pdf', size: 1048576, type: 'application/pdf' },
          ],
          status: 'new',
          notes: 'High priority lead from tech company.',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'inq-mock-2',
          full_name: 'Sophia Martinez',
          company: 'Creative Studios',
          email: 'sophia@creativestudios.com',
          phone: null,
          website: null,
          services: ['Website Development', 'Graphic Design'],
          budget: '₱20,000 – ₱50,000',
          timeline: 'ASAP',
          project_type: 'Redesign',
          feature_chips: ['Mobile Responsive'],
          description: 'Need a complete modern website redesign for our visual media brand.',
          attachments: [],
          status: 'booked',
          notes: 'Discovery call booked.',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ];
      setInquiries(mockInquiries);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
      } else {
        setInquiries(data || []);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleInquiryUpdate = (updated: InquiryRow) => {
    setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedInquiry(updated);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase">New</span>;
      case 'reviewed':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase">Reviewed</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase">Contacted</span>;
      case 'booked':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">Call Booked</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-gray-500/15 border border-gray-500/30 text-gray-400 text-[10px] font-bold uppercase">Completed</span>;
      case 'archived':
        return <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-500/15 border border-gray-500/30 text-gray-400 text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-neutralfacebold text-2xl uppercase tracking-tight text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-sky-400" />
            <span>Inquiries Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track client brief submissions, status updates, and scope details.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, or service..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {['all', 'new', 'reviewed', 'contacted', 'booked', 'completed', 'archived'].map((st) => (
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
      </div>

      {/* Inquiries Data Table */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Inquiries...</span>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="py-16 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
          <Inbox className="w-10 h-10 text-gray-500 mx-auto" />
          <p className="text-sm font-semibold text-gray-300">No inquiries found</p>
          <p className="text-xs text-gray-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try clearing your search or status filters.'
              : 'New client inquiries will automatically show up here.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-[10px] text-gray-400 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Services</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                        {inq.full_name}
                      </div>
                      <div className="text-[11px] text-gray-500">{inq.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="max-w-[200px] truncate font-medium">
                        {inq.services.join(', ')}
                      </div>
                      <div className="text-[10px] text-gray-500">{inq.project_type}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sky-400">{inq.budget}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(inq.status)}</td>
                    <td className="py-3.5 px-4 text-[11px] text-gray-400 font-mono">
                      {new Date(inq.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Inquiry Detail Panel */}
      <InquiryDetailPanel
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onUpdate={handleInquiryUpdate}
      />
    </div>
  );
};
