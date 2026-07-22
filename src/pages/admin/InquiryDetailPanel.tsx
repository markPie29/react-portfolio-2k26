import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { InquiryRow, InquiryStatus } from '../../types/database';
import {
  X,
  Mail,
  Building2,
  Phone,
  Globe,
  FileText,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface PanelProps {
  inquiry: InquiryRow | null;
  onClose: () => void;
  onUpdate: (updated: InquiryRow) => void;
}

const STATUS_OPTIONS: { id: InquiryStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New Inquiry', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { id: 'reviewed', label: 'Reviewed', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { id: 'booked', label: 'Call Booked', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'completed', label: 'Completed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' },
  { id: 'archived', label: 'Archived', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
];

export const InquiryDetailPanel: React.FC<PanelProps> = ({ inquiry, onClose, onUpdate }) => {
  const [status, setStatus] = useState<InquiryStatus>('new');
  const [notes, setNotes] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setNotes(inquiry.notes || '');
      setMeetingLink('');
      setSavedSuccess(false);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('inquiries')
        .update({ status, notes, updated_at: new Date().toISOString() })
        .eq('id', inquiry.id);

      if (error) {
        alert(`Failed to save changes: ${error.message}`);
        setIsSaving(false);
        return;
      }

      // If meeting link provided, check if a booking exists and update it
      if (meetingLink.trim()) {
        await supabase
          .from('bookings')
          .update({ meeting_link: meetingLink.trim() })
          .eq('inquiry_id', inquiry.id);
      }
    }

    const updatedInquiry: InquiryRow = {
      ...inquiry,
      status,
      notes,
      updated_at: new Date().toISOString(),
    };

    onUpdate(updatedInquiry);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#0c1017] border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 space-y-6 text-gray-100 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] text-gray-400 font-mono">ID: {inquiry.id}</span>
              <h2 className="font-neutralfacebold text-xl uppercase tracking-tight text-white">
                {inquiry.full_name}
              </h2>
              {inquiry.company && (
                <p className="text-xs text-sky-400 font-medium">{inquiry.company}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Inquiry Lifecycle Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    status === opt.id
                      ? opt.color + ' ring-2 ring-sky-500/50 scale-105'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 text-xs">
            <h4 className="font-neutralfacebold text-sky-400 uppercase tracking-wider text-[11px]">
              Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline truncate">
                  {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{inquiry.phone}</span>
                </div>
              )}
              {inquiry.company && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{inquiry.company}</span>
                </div>
              )}
              {inquiry.website && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Globe className="w-4 h-4 text-sky-500 shrink-0" />
                  <a
                    href={
                      inquiry.website.startsWith('http')
                        ? inquiry.website
                        : `https://${inquiry.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline truncate flex items-center gap-1"
                  >
                    <span>{inquiry.website}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Project Scope & Budget */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 text-xs">
            <h4 className="font-neutralfacebold text-sky-400 uppercase tracking-wider text-[11px]">
              Scope & Requirements
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Services</span>
                <span className="text-white font-medium">{inquiry.services.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Budget</span>
                <span className="text-sky-400 font-bold">{inquiry.budget}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Timeline</span>
                <span className="text-white font-medium">{inquiry.timeline}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Project Type</span>
                <span className="text-white font-medium">{inquiry.project_type}</span>
              </div>
            </div>

            {inquiry.feature_chips && inquiry.feature_chips.length > 0 && (
              <div className="pt-2">
                <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                  Feature Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inquiry.feature_chips.map((chip) => (
                    <span
                      key={chip}
                      className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description Brief */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Client Description & Brief
            </label>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
              {inquiry.description}
            </div>
          </div>

          {/* Attachments */}
          {inquiry.attachments && inquiry.attachments.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Uploaded Attachments ({inquiry.attachments.length})
              </label>
              <div className="space-y-2">
                {inquiry.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate text-white font-medium">{file.name}</span>
                      <span className="text-gray-500 text-[10px]">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <span>View File</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Link Entry (Manual Google Meet / Zoom) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Manual Meeting Link (Google Meet / Zoom)
            </label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/abc-defg-hij"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          {/* Admin Private Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Admin Private Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about pricing, client discussions, or scope agreements..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase text-gray-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-white font-neutralfacebold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
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
  );
};
