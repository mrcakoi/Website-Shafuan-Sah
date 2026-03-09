import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  // createBrowserClient akan automatik uruskan cookies supaya middleware boleh baca
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}