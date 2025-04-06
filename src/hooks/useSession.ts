'use client'

import { useEffect, useState } from 'react'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/api/supabase/client'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
} 