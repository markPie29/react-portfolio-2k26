// In-memory rate limiting store for Vercel Serverless Function
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up expired IP keys periodically to prevent memory leaks
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

const ALLOWED_PROJECT_TYPES = ['graphic-design', 'software', 'social-media', 'General Inquiry', 'Other'];

export default async function handler(req: any, res: any) {
  // 1. CORS Origin Guard
  const clientOrigin = req.headers?.origin || '';
  const allowedOrigins = ['https://markyisulat.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
  if (allowedOrigins.includes(clientOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', clientOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Server-side Rate Limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfter || 600));
    return res.status(429).json({ error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.` });
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

    // 3. Strict Input Validation & Length Bounds
    if (!fullName || !email || !description || !projectType) {
      return res.status(400).json({ error: 'Missing required inquiry fields' });
    }

    const cleanFullName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanDescription = String(description).trim();
    const cleanProjectType = String(projectType).trim();

    if (cleanFullName.length < 2 || cleanFullName.length > 100) {
      return res.status(400).json({ error: 'Full name must be between 2 and 100 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 150) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    if (cleanDescription.length < 10 || cleanDescription.length > 5000) {
      return res.status(400).json({ error: 'Description must be between 10 and 5000 characters' });
    }

    // 4. Cloudflare Turnstile Verification (Mandatory when secret key configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return res.status(400).json({ error: 'CAPTCHA verification token missing.' });
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

      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        return res.status(400).json({ error: 'CAPTCHA verification failed. Please refresh and try again.' });
      }
    }

    // 5. Send Discord Webhook Notification securely from backend
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
    // Sanitize error message returned to client
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
