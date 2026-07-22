import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/^['"]|['"]$/g, '');

export const isSupabaseConfigured = Boolean(
  rawUrl &&
    rawKey &&
    !rawUrl.includes('placeholder') &&
    !rawUrl.includes('your-project-id') &&
    !rawUrl.includes('your-supabase-project') &&
    !rawKey.includes('placeholder') &&
    !rawKey.includes('your-supabase-anon-key') &&
    rawUrl.startsWith('http')
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or set to placeholder values. Operating in local preview fallback mode.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
