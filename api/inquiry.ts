export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      fullName,
      company,
      email,
      phone,
      website,
      projectType,
      description,
      inquiryId,
      turnstileToken,
      bookedDate,
      bookedTime,
    } = body;

    // 1. Basic validation
    if (!fullName || !email || !description || !projectType) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }

    // 2. Cloudflare Turnstile Verification (if secret key configured on Vercel)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileToken) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      });

      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        return res.status(400).json({ error: 'CAPTCHA verification failed. Please try again.' });
      }
    }

    // 3. Send Discord Webhook Notification securely from backend
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.VITE_DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const fields: any[] = [
        { name: 'Client Name', value: String(fullName).substring(0, 100), inline: true },
        { name: 'Email', value: String(email).substring(0, 150), inline: true },
        { name: 'Project Type', value: String(projectType || 'N/A'), inline: true },
        { name: 'Company', value: company ? String(company).substring(0, 100) : 'N/A', inline: true },
        { name: 'Phone', value: phone ? String(phone) : 'N/A', inline: true },
        { name: 'Website', value: website ? String(website) : 'N/A', inline: true },
      ];

      if (bookedDate && bookedTime) {
        fields.push({
          name: '📅 Scheduled Discovery Call',
          value: `${bookedDate} at ${bookedTime}`,
          inline: false,
        });
      }

      fields.push({ name: 'Description', value: String(description).substring(0, 1000), inline: false });

      const discordPayload = {
        embeds: [
          {
            title: bookedDate ? '🚀 New Project Inquiry & Discovery Call Booked!' : '🚀 New Project Inquiry Received!',
            color: 38859, // #0077b6 (Sky blue)
            fields,
            footer: { text: `Inquiry ID: ${inquiryId || 'N/A'} • Portfolio Backend (Vercel)` },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
      });
    }

    return res.status(200).json({ success: true, message: 'Notification dispatched successfully' });
  } catch (error: any) {
    console.error('Vercel Function Inquiry Notification Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
