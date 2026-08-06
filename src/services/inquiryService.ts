import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProjectInquiryFormData } from '../types/inquirySchema';

export interface SubmitInquiryPayload extends ProjectInquiryFormData {
  turnstileToken?: string;
  bookedDate?: string;
  bookedTime?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  inquiryId?: string;
  error?: string;
}

// Sanitize strings (trim and escape raw script tags)
const sanitizeText = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const formatTimeLabel = (time24: string): string => {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minStr || '00'} ${period}`;
};

// Client-side rate limiting check using sessionStorage
const checkRateLimit = (): { allowed: boolean; message?: string } => {
  try {
    const lastSubmitKey = 'inquiry_last_submit_time';
    const submitCountKey = 'inquiry_submit_count_window';

    const now = Date.now();
    const lastSubmit = parseInt(sessionStorage.getItem(lastSubmitKey) || '0', 10);
    const windowData = JSON.parse(sessionStorage.getItem(submitCountKey) || '{"count":0, "start":0}');

    // 1. Minimum 30s cooldown between submissions
    if (now - lastSubmit < 30000) {
      const waitSec = Math.ceil((30000 - (now - lastSubmit)) / 1000);
      return {
        allowed: false,
        message: `Please wait ${waitSec} seconds before submitting another inquiry.`,
      };
    }

    // 2. Max 5 submissions per 10-minute window
    if (now - windowData.start > 600000) {
      sessionStorage.setItem(submitCountKey, JSON.stringify({ count: 1, start: now }));
    } else if (windowData.count >= 5) {
      return {
        allowed: false,
        message: 'Too many inquiry attempts. Please try again in 10 minutes.',
      };
    } else {
      sessionStorage.setItem(
        submitCountKey,
        JSON.stringify({ count: windowData.count + 1, start: windowData.start })
      );
    }

    sessionStorage.setItem(lastSubmitKey, now.toString());
    return { allowed: true };
  } catch (e) {
    return { allowed: true }; // Fallback if storage fails
  }
};

// Trigger serverless function (Vercel / Netlify or direct fallback in local preview mode)
export const triggerNotification = async (payload: SubmitInquiryPayload, inquiryId: string) => {
  try {
    // 1. Try Vercel API function first
    let res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        inquiryId,
      }),
    });

    // 2. Fallback to Netlify function if on Netlify
    if (!res.ok) {
      res = await fetch('/.netlify/functions/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          inquiryId,
        }),
      });
    }

    if (!res.ok) {
      // Client-side fallback only active in local development mode
      if (import.meta.env.DEV) {
        const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
        if (webhookUrl) {
          const fields: any[] = [
            { name: 'Client Name', value: payload.fullName, inline: true },
            { name: 'Email', value: payload.email, inline: true },
            { name: 'Project Type', value: payload.projectType, inline: true },
            { name: 'Company', value: payload.company || 'N/A', inline: true },
            { name: 'Phone', value: payload.phone || 'N/A', inline: true },
            { name: 'Website', value: payload.website || 'N/A', inline: true },
          ];

          if (payload.bookedDate && payload.bookedTime) {
            fields.push({
              name: '📅 Scheduled Discovery Call',
              value: `${payload.bookedDate} at ${formatTimeLabel(payload.bookedTime)}`,
              inline: false,
            });
          }

          fields.push({ name: 'Description', value: payload.description, inline: false });

          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [
                {
                  title: '🚀 New Project Inquiry & Discovery Call Booked!',
                  color: 38859,
                  fields,
                  footer: { text: `Inquiry ID: ${inquiryId}` },
                  timestamp: new Date().toISOString(),
                },
              ],
            }),
          });
        }
      }
    }
  } catch (err) {
    console.warn('Notification trigger notice:', err);
  }
};

export const deleteProjectInquiry = async (inquiryId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return true;
  try {
    const { error } = await supabase.from('inquiries').delete().eq('id', inquiryId);
    if (error) {
      console.error('Failed to rollback inquiry record:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Unexpected error rolling back inquiry:', e);
    return false;
  }
};

export const submitProjectInquiry = async (
  payload: SubmitInquiryPayload,
  options?: { skipNotification?: boolean }
): Promise<InquiryResponse> => {
  // Rate limit check
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      message: rateLimitCheck.message || 'Rate limit exceeded.',
    };
  }

  // Sanitize text inputs
  const sanitizedPayload: SubmitInquiryPayload = {
    ...payload,
    fullName: sanitizeText(payload.fullName),
    company: payload.company ? sanitizeText(payload.company) : undefined,
    email: payload.email.trim(),
    phone: payload.phone ? sanitizeText(payload.phone) : undefined,
    website: payload.website ? payload.website.trim() : undefined,
    projectType: sanitizeText(payload.projectType),
    description: sanitizeText(payload.description),
  };

  if (!isSupabaseConfigured) {
    console.log('Simulating inquiry delivery (Supabase env missing):', sanitizedPayload);
    const mockId = `INQ-DEV-${Date.now().toString(36).toUpperCase()}`;
    if (!options?.skipNotification) {
      await triggerNotification(sanitizedPayload, mockId);
    }
    return {
      success: true,
      message: 'Inquiry received in local preview fallback mode!',
      inquiryId: mockId,
    };
  }

  try {
    const inquiryId = crypto.randomUUID();

    // Insert into Supabase `inquiries` table
    const { error } = await supabase.from('inquiries').insert([
      {
        id: inquiryId,
        full_name: sanitizedPayload.fullName,
        company: sanitizedPayload.company || null,
        email: sanitizedPayload.email,
        phone: sanitizedPayload.phone || null,
        website: sanitizedPayload.website || null,
        project_type: sanitizedPayload.projectType,
        description: sanitizedPayload.description,
        status: 'new',
      },
    ]);

    if (error) {
      console.error('Supabase Inquiry Insert Error:', error);
      const isFetchErr =
        error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError');
      return {
        success: false,
        message: 'Failed to record inquiry into database.',
        error: isFetchErr
          ? 'Cannot reach Supabase database. Check VITE_SUPABASE_URL configuration.'
          : error.message,
      };
    }

    // Trigger server-side notification unless skipped (e.g. waiting for booking)
    if (!options?.skipNotification) {
      triggerNotification(sanitizedPayload, inquiryId);
    }

    return {
      success: true,
      message: 'Inquiry submitted successfully!',
      inquiryId,
    };
  } catch (err: any) {
    console.error('Unexpected inquiry submission error:', err);
    return {
      success: false,
      message: 'Unable to connect to database.',
      error: err?.message || 'Unknown error',
    };
  }
};
