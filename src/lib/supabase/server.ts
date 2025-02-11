import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string): string | undefined => {
          return cookies().get(name)?.value
        },
        set: (name: string, value: string, options?: CookieOptions): void => {
          cookies().set({ name, value, ...options })
        },
        remove: (name: string, options?: CookieOptions): void => {
          cookies().set({ name, value: '', ...options })
        },
      },
    }
  )
}
