import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// SERVER-ONLY. Never import into a Client Component.
// This bypasses Row Level Security entirely using the service_role key.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}