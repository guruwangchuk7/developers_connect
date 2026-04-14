import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase project credentials missing — local development requires .env, Vercel requires environment variables in Dashboard.");
    return null as unknown as SupabaseClient; // Allow the build to continue if it doesn't strictly need the client for data fetching during SSG
  }

  return createBrowserClient(url, anonKey);
}
