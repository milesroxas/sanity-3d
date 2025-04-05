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

const supabaseServiceRoleKey = assertValue(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY"
);

// Service role client for server-side use
export const supabaseServiceClient: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);
