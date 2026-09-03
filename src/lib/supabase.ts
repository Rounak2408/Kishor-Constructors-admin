import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.VITE_SUPABASE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Get configured public website URL
export const getPublicWebsiteUrl = (): string => {
  const saved = localStorage.getItem('kc_public_website_url');
  if (saved) return saved;
  return metaEnv.VITE_PUBLIC_WEBSITE_URL || 'https://kishorconstruction.com';
};

// Set configured public website URL
export const setPublicWebsiteUrl = (url: string) => {
  localStorage.setItem('kc_public_website_url', url);
};
