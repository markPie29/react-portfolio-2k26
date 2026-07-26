import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProjectInquiryFormData, InquiryFileAttachment } from '../types/inquirySchema';
import { InquiryAttachment } from '../types/database';

export interface SubmitInquiryPayload extends ProjectInquiryFormData {
  attachments?: InquiryFileAttachment[];
  turnstileToken?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  inquiryId?: string;
  error?: string;
}

// Convert Base64 data URL to Blob for Supabase Storage Upload
const base64ToBlob = (base64Data: string): Blob => {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'application/octet-stream';
  const raw = window.atob(parts[1] || parts[0]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

// Sanitize strings (trim and escape raw script tags)
const sanitizeText = (str: string | undefined | null): string => {
  if (!str) return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

// Trigger serverless Netlify function (or direct fallback in local preview mode)
const triggerNotification = async (payload: SubmitInquiryPayload, inquiryId: string) => {
  try {
    // Try calling Netlify serverless function first (handles Discord notification securely)
    const res = await fetch('/.netlify/functions/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        inquiryId,
      }),
    });

    if (!res.ok) {
      // Fallback: check if client-side webhook is available for local dev
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: '🚀 New Project Inquiry Received!',
                color: 38859,
                fields: [
                  { name: 'Client Name', value: payload.fullName, inline: true },
                  { name: 'Email', value: payload.email, inline: true },
                  { name: 'Services', value: payload.services.join(', '), inline: false },
                  { name: 'Budget', value: payload.budget, inline: true },
                  { name: 'Timeline', value: payload.timeline, inline: true },
                  { name: 'Description', value: payload.description, inline: false },
                ],
                footer: { text: `Inquiry ID: ${inquiryId}` },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      }
    }
  } catch (err) {
    console.warn('Notification trigger notice:', err);
  }
};

export const submitProjectInquiry = async (
  payload: SubmitInquiryPayload
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
    description: sanitizeText(payload.description),
  };

  if (!isSupabaseConfigured) {
    console.log('Simulating inquiry delivery (Supabase env missing):', sanitizedPayload);
    const mockId = `INQ-DEV-${Date.now().toString(36).toUpperCase()}`;
    await triggerNotification(sanitizedPayload, mockId);
    return {
      success: true,
      message: 'Inquiry received in local preview fallback mode!',
      inquiryId: mockId,
    };
  }

  try {
    const processedAttachments: InquiryAttachment[] = [];

    // 1. Process attachments if provided (limit max 5)
    const filesToUpload = (sanitizedPayload.attachments || []).slice(0, 5);

    for (const file of filesToUpload) {
      if (file.content) {
        try {
          const blob = base64ToBlob(file.content);
          const rawExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
          const safeExt = ['pdf', 'png', 'jpg', 'jpeg', 'svg', 'zip', 'fig'].includes(rawExt)
            ? rawExt
            : 'bin';
          const filePath = `inquiry-${Date.now()}-${Math.random().toString(36).substring(7)}.${safeExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('inquiry-attachments')
            .upload(filePath, blob);

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('inquiry-attachments')
              .getPublicUrl(uploadData.path);

            processedAttachments.push({
              name: sanitizeText(file.name),
              size: file.size,
              type: file.type,
              url: urlData.publicUrl,
            });
            continue;
          }
        } catch (e) {
          console.warn('Storage upload exception, storing metadata fallback:', e);
        }
      }

      processedAttachments.push({
        name: sanitizeText(file.name),
        size: file.size,
        type: file.type,
      });
    }

    const inquiryId = crypto.randomUUID();

    // 2. Insert into Supabase `inquiries` table
    const { error } = await supabase.from('inquiries').insert([
      {
        id: inquiryId,
        full_name: sanitizedPayload.fullName,
        company: sanitizedPayload.company || null,
        email: sanitizedPayload.email,
        phone: sanitizedPayload.phone || null,
        website: sanitizedPayload.website || null,
        services: sanitizedPayload.services,
        budget: sanitizedPayload.budget,
        timeline: sanitizedPayload.timeline,
        project_type: sanitizedPayload.projectType,
        feature_chips: sanitizedPayload.featureChips || [],
        description: sanitizedPayload.description,
        attachments: processedAttachments,
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

    // 3. Trigger server-side notification (Discord webhook)
    triggerNotification(sanitizedPayload, inquiryId);

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
