import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProjectInquiryFormData, InquiryFileAttachment } from '../types/inquirySchema';
import { InquiryAttachment } from '../types/database';

export interface SubmitInquiryPayload extends ProjectInquiryFormData {
  attachments?: InquiryFileAttachment[];
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

// Optional: Send free instant notification to Discord Webhook if configured
const triggerDiscordNotification = async (payload: SubmitInquiryPayload, inquiryId: string) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const content = {
      embeds: [
        {
          title: '🚀 New Project Inquiry Received!',
          color: 38859, // #0077b6 (Sky blue)
          fields: [
            { name: 'Client Name', value: payload.fullName, inline: true },
            { name: 'Email', value: payload.email, inline: true },
            { name: 'Company', value: payload.company || 'N/A', inline: true },
            { name: 'Services', value: payload.services.join(', '), inline: false },
            { name: 'Budget', value: payload.budget, inline: true },
            { name: 'Timeline', value: payload.timeline, inline: true },
            { name: 'Project Type', value: payload.projectType, inline: true },
            { name: 'Description', value: payload.description, inline: false },
          ],
          footer: { text: `Inquiry ID: ${inquiryId} • Portfolio Backend` },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
  } catch (err) {
    console.warn('Failed to send Discord webhook alert:', err);
  }
};

export const submitProjectInquiry = async (
  payload: SubmitInquiryPayload
): Promise<InquiryResponse> => {
  if (!isSupabaseConfigured) {
    console.log('Simulating inquiry delivery (Supabase env vars missing):', payload);
    const mockId = `INQ-DEV-${Date.now().toString(36).toUpperCase()}`;
    await triggerDiscordNotification(payload, mockId);
    return {
      success: true,
      message: 'Inquiry received in local preview mode!',
      inquiryId: mockId,
    };
  }

  try {
    const processedAttachments: InquiryAttachment[] = [];

    // 1. Process attachments if provided
    if (payload.attachments && payload.attachments.length > 0) {
      for (const file of payload.attachments) {
        if (file.content) {
          try {
            const blob = base64ToBlob(file.content);
            const fileExt = file.name.split('.').pop();
            const filePath = `inquiry-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('inquiry-attachments')
              .upload(filePath, blob);

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from('inquiry-attachments')
                .getPublicUrl(uploadData.path);

              processedAttachments.push({
                name: file.name,
                size: file.size,
                type: file.type,
                url: urlData.publicUrl,
              });
              continue;
            }
          } catch (e) {
            console.warn('Storage upload error, storing metadata fallback:', e);
          }
        }

        processedAttachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    }

    // 2. Insert into Supabase `inquiries` table
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          full_name: payload.fullName,
          company: payload.company || null,
          email: payload.email,
          phone: payload.phone || null,
          website: payload.website || null,
          services: payload.services,
          budget: payload.budget,
          timeline: payload.timeline,
          project_type: payload.projectType,
          feature_chips: payload.featureChips || [],
          description: payload.description,
          attachments: processedAttachments,
          status: 'new',
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase Inquiry Insert Error:', error);
      return {
        success: false,
        message: 'Failed to record inquiry into database. Please try again.',
        error: error.message,
      };
    }

    const inquiryId = data?.id || `INQ-${Date.now()}`;

    // 3. Trigger free background Discord/Telegram notification if configured
    triggerDiscordNotification(payload, inquiryId);

    return {
      success: true,
      message: 'Inquiry submitted successfully!',
      inquiryId,
    };
  } catch (err: any) {
    console.error('Unexpected inquiry submission error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: err?.message || 'Unknown error',
    };
  }
};
