// In-memory rate limiting store for Netlify Function
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function cleanupStore() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  cleanupStore();
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true };
}

export const handler = async (event: any) => {
  const clientOrigin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOrigins = ['https://markyisulat.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (allowedOrigins.includes(clientOrigin)) {
    headers['Access-Control-Allow-Origin'] = clientOrigin;
  }

  if (event.httpMethod === 'OPTIONS') {
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Rate limit check
  const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    headers['Retry-After'] = String(rateLimit.retryAfter || 600);
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.` }),
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
      projectType,
      description,
      inquiryId,
      turnstileToken,
      bookedDate,
      bookedTime,
    } = body;

    // Basic & Length Validation
    if (!fullName || !email || !description || !projectType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required inquiry fields' }),
      };
    }

    const cleanFullName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanDescription = String(description).trim();
    const cleanProjectType = String(projectType).trim();

    if (cleanFullName.length < 2 || cleanFullName.length > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Full name must be between 2 and 100 characters' }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 150) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address format' }),
      };
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 5000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Description must be between 10 and 5000 characters' }),
      };
    }

    // Cloudflare Turnstile Verification (Mandatory when secret key configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'CAPTCHA verification token missing.' }),
        };
      }

      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: clientIp,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }),
        };
      }
    }

    // Send Discord Webhook Notification
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.VITE_DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const fields: any[] = [
        { name: 'Client Name', value: cleanFullName.substring(0, 100), inline: true },
        { name: 'Email', value: cleanEmail.substring(0, 150), inline: true },
        { name: 'Project Type', value: cleanProjectType.substring(0, 50), inline: true },
        { name: 'Company', value: company ? String(company).trim().substring(0, 100) : 'N/A', inline: true },
        { name: 'Phone', value: phone ? String(phone).trim().substring(0, 30) : 'N/A', inline: true },
        { name: 'Website', value: website ? String(website).trim().substring(0, 200) : 'N/A', inline: true },
      ];

      if (bookedDate && bookedTime) {
        fields.push({
          name: '📅 Scheduled Discovery Call',
          value: `${bookedDate} at ${bookedTime}`,
          inline: false,
        });
      }

      fields.push({ name: 'Description', value: cleanDescription.substring(0, 1000), inline: false });

      const discordPayload = {
        embeds: [
          {
            title: bookedDate ? '🚀 New Project Inquiry & Discovery Call Booked!' : '🚀 New Project Inquiry Received!',
            color: 38859,
            fields,
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
      headers,
      body: JSON.stringify({ success: true, message: 'Notification dispatched successfully' }),
    };
  } catch (error: any) {
    console.error('Netlify Function Inquiry Notification Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
};
