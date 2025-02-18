import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Assert environment variables
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

const supabaseUrl = assertValue(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
);

const supabaseAnonKey = assertValue(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
);

// Public client for client-side use
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
