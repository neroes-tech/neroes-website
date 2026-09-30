import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-only client (service role key, bypasses RLS). Never import this from a Client Component.
// Returns null when env vars are absent so callers can degrade gracefully in dev.
// Requests give up after 5s, so an unreachable project can't hold a request
// open until the platform's function timeout.
export const supabaseAdmin =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(5000) }),
        },
      })
    : null;
