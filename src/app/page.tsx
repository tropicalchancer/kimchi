'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { PostForm, PostList } from '@/features/posts'
import { StreakLeaderboard } from '@/features/streaks'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200">
              <div className="border-b border-gray-200">
                <PostForm />
              </div>
              <PostList />
            </div>
          </div>
          <div className="md:sticky md:top-6 space-y-6 self-start">
            <StreakLeaderboard />
          </div>
        </div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">Join Kimchi</h1>
            <div className="flex -space-x-2 mb-8">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#D9361E] to-[#FF8C77] flex items-center justify-center text-white text-xl font-medium shadow-sm"
                >
                  🥬
                </div>
              ))}
            </div>
            <p className="text-2xl mb-8">Ship with these and many other makers</p>
            
            <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Kimchi is a cozy community for makers.</h2>
              <p className="text-gray-700 mb-6">
                We celebrate wins, provide support during challenges, and maintain gentle accountability 
                while creating meaningful progress on our projects.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#D9361E] hover:bg-[#B22D19] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E] shadow-sm"
              >
                Join Kimchi
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-12 shadow-sm border border-gray-100">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#D9361E] to-[#FF8C77] text-transparent bg-clip-text">We&apos;re a group of makers shipping together.</h2>
            <p className="text-xl text-gray-700 mb-12">
              From indie hackers to established creators building sustainable projects.
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 flex items-start space-x-4 shadow-sm border border-gray-100">
                <span className="text-2xl">🚢</span>
                <div>
                  <h3 className="font-semibold text-xl">Build better habits</h3>
                  <p className="text-gray-600">by surrounding yourself with productive makers.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 flex items-start space-x-4 shadow-sm border border-gray-100">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-semibold text-xl">Get advice & feedback</h3>
                  <p className="text-gray-600">from experienced creators and makers.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 flex items-start space-x-4 shadow-sm border border-gray-100">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-xl">Stay accountable</h3>
                  <p className="text-gray-600">by publicly sharing your progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
