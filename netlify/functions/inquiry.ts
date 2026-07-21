import { Resend } from 'resend';

const TARGET_EMAIL = process.env.RECIPIENT_EMAIL || 'markyisulat@gmail.com';
const resendKey = process.env.RESEND_API_KEY;

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 450,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      fullName,
      company,
      email,
      phone,
      website,
      services,
      budget,
      timeline,
      projectType,
      featureChips,
      description,
      attachments
    } = body;

    const formattedServices = Array.isArray(services) ? services.join(', ') : services;
    const formattedChips = Array.isArray(featureChips) && featureChips.length > 0
      ? featureChips.map((chip: string) => `<span style="display:inline-block; background:#0077b6; color:#ffffff; padding:4px 10px; border-radius:12px; font-size:12px; margin:2px;">${chip}</span>`).join(' ')
      : 'None specified';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0077b6, #00b4d8); color: #fff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚀 New Project Inquiry Received</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">From ${fullName} (${company || 'Individual'})</p>
        </div>
        
        <div style="padding: 24px;">
          <h2 style="color: #0077b6; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; font-size: 18px;">👤 Client Contact Details</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="font-weight: bold; width: 130px;">Name:</td><td>${fullName}</td></tr>
            <tr><td style="font-weight: bold;">Email:</td><td><a href="mailto:${email}" style="color: #0077b6;">${email}</a></td></tr>
            ${company ? `<tr><td style="font-weight: bold;">Company:</td><td>${company}</td></tr>` : ''}
            ${phone ? `<tr><td style="font-weight: bold;">Phone:</td><td>${phone}</td></tr>` : ''}
            ${website ? `<tr><td style="font-weight: bold;">Website:</td><td><a href="${website}" target="_blank" style="color: #0077b6;">${website}</a></td></tr>` : ''}
          </table>

          <h2 style="color: #0077b6; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; font-size: 18px;">📊 Project Scope & Budget</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="font-weight: bold; width: 130px;">Services Requested:</td><td>${formattedServices}</td></tr>
            <tr><td style="font-weight: bold;">Budget Range:</td><td><strong>${budget}</strong></td></tr>
            <tr><td style="font-weight: bold;">Timeline:</td><td>${timeline}</td></tr>
            <tr><td style="font-weight: bold;">Project Type:</td><td>${projectType}</td></tr>
          </table>

          <h2 style="color: #0077b6; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; font-size: 18px;">✨ Feature Tags</h2>
          <div style="margin-bottom: 20px;">${formattedChips}</div>

          <h2 style="color: #0077b6; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; font-size: 18px;">📝 Project Description</h2>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 6px; border-left: 4px solid #0077b6; white-space: pre-wrap; margin-bottom: 20px;">
            ${description}
          </div>

          ${Array.isArray(attachments) && attachments.length > 0 ? `
            <h2 style="color: #0077b6; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; font-size: 18px;">📎 Attachments (${attachments.length})</h2>
            <ul>
              ${attachments.map((att: any) => `<li>${att.name} (${Math.round(att.size / 1024)} KB)</li>`).join('')}
            </ul>
          ` : ''}
        </div>

        <div style="background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #777;">
          <p style="margin: 0;">Sent automatically from Portfolio Website Project Inquiry System</p>
        </div>
      </div>
    `;

    if (!resendKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Inquiry received in dev mode (RESEND_API_KEY missing).',
          inquiryId: `DEV-${Date.now()}`,
        }),
      };
    }

    const resend = new Resend(resendKey);
    const resendAttachments = Array.isArray(attachments)
      ? attachments.map((att: any) => ({
          filename: att.name,
          content: att.content.split(',')[1] || att.content,
        }))
      : [];

    const data = await resend.emails.send({
      from: 'Portfolio Inquiry <onboarding@resend.dev>',
      to: TARGET_EMAIL,
      subject: `New Inquiry from ${fullName} [${projectType || 'Project'}]`,
      html: htmlContent,
      replyTo: email,
      attachments: resendAttachments,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Inquiry sent successfully', inquiryId: data.data?.id }),
    };
  } catch (error: any) {
    console.error('Netlify Function Inquiry Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
    };
  }
};
