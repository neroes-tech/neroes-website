import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-only client (service role key, bypasses RLS). Never import this from a Client Component.
// Returns null when env vars are absent so callers can degrade gracefully in dev.
export const supabaseAdmin = url && key ? createClient(url, key) : null;
