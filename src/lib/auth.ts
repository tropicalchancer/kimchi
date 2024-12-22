// lib/supabase/auth.ts
import { createServerSupabaseClient } from './supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function auth() {
  const supabase = createServerSupabaseClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Auth error:', error)
    return null
  }

  if (!session) {
    return null
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: session.user.id,
    }
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createServerSupabaseClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}