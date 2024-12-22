// lib/supabase/client.ts should look like this:
import { createBrowserClient } from '@supabase/ssr'

const createClientSupabaseClient = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export { createClientSupabaseClient }  // Named export