"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export function AuthButton() {
  const { user } = useAuth()

  async function signIn() {
    const supabase = createClientSupabaseClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  async function signOut() {
    const supabase = createClientSupabaseClient()
    await supabase.auth.signOut()
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={signIn}>
        Sign in with GitHub
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={signOut}>
      Sign out
    </Button>
  )
}

