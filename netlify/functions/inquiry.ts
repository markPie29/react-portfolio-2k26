export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
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
      inquiryId,
      turnstileToken
    } = body;

    // 1. Basic validation
    if (!fullName || !email || !description || !services || !budget || !timeline) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required inquiry fields' }),
      };
    }

    // 2. Cloudflare Turnstile Verification (if secret key configured on Netlify server)
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

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }),
        };
      }
    }

    // 3. Send Discord Webhook Notification securely from backend
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.VITE_DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const formattedServices = Array.isArray(services) ? services.join(', ') : String(services || '');
      const discordPayload = {
        embeds: [
          {
            title: '🚀 New Project Inquiry Received!',
            color: 38859, // #0077b6 (Sky blue)
            fields: [
              { name: 'Client Name', value: String(fullName).substring(0, 100), inline: true },
              { name: 'Email', value: String(email).substring(0, 150), inline: true },
              { name: 'Company', value: company ? String(company).substring(0, 100) : 'N/A', inline: true },
              { name: 'Services', value: formattedServices.substring(0, 250), inline: false },
              { name: 'Budget', value: String(budget || 'N/A'), inline: true },
              { name: 'Timeline', value: String(timeline || 'N/A'), inline: true },
              { name: 'Project Type', value: String(projectType || 'N/A'), inline: true },
              { name: 'Phone', value: phone ? String(phone) : 'N/A', inline: true },
              { name: 'Website', value: website ? String(website) : 'N/A', inline: true },
              { name: 'Description', value: String(description).substring(0, 1000), inline: false },
            ],
            footer: { text: `Inquiry ID: ${inquiryId || 'N/A'} • Portfolio Backend` },
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Notification dispatched successfully' }),
    };
  } catch (error: any) {
    console.error('Netlify Function Inquiry Notification Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
    };
  }
};
