'use client'

import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    // Set redirect URL after component mounts (client-side only)
    setRedirectUrl(`${window.location.origin}/auth/callback`)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkUser()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/')
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8">
          <span className="mr-1 text-2xl">🥬</span>
          <span className="text-2xl font-bold" style={{ color: '#D9361E' }}>kimchi</span>
        </Link>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome to Kimchi
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join our cozy community of makers and collaborators
        </p>
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#D9361E',
                    brandAccent: '#B22D19',
                    inputBackground: 'white',
                    inputText: '#111827',
                    inputBorder: '#E5E7EB',
                    inputBorderHover: '#D9361E',
                    inputBorderFocus: '#D9361E',
                  },
                },
              },
              style: {
                button: {
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '8px 16px',
                },
                input: {
                  borderRadius: '6px',
                  fontSize: '14px',
                  padding: '8px 12px',
                },
                anchor: {
                  color: '#D9361E',
                },
              },
            }}
            providers={['github']}
            redirectTo={redirectUrl}
            theme="default"
          />
        </div>
      </div>
    </div>
  )
} 