# Cloudflare Turnstile Bot Protection Setup

To complete the bot protection setup for your project inquiry form:

### 1. Create a Cloudflare Account & Site
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and create a free account (or log in).
2. On the left sidebar, navigate to **Turnstile**.
3. Click **Add Site**.
4. Set the **Site Name** to `Marked Media Portfolio`.
5. Set **Domain** to `markyisulat.vercel.app` (and `localhost` for testing).
6. Select **Managed** widget mode.
7. Click **Create**.

### 2. Copy API Keys
You will be provided with two keys:
- **Site Key** (Public - starts with `0x4...`)
- **Secret Key** (Private - starts with `0x4...`)

### 3. Configure Vercel Environment Variables
Go to your Vercel Dashboard -> Project (`react-portfolio-2k26`) -> **Settings** -> **Environment Variables**, and add:

| Key | Value | Scope |
|-----|-------|-------|
| `VITE_TURNSTILE_SITE_KEY` | *[Your Site Key]* | Production, Preview, Development |
| `TURNSTILE_SECRET_KEY` | *[Your Secret Key]* | Production, Preview, Development |

### 4. Redeploy
Trigger a redeployment on Vercel or push to `main` so the new environment variables take effect.
