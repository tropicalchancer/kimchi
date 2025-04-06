'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { PostForm, PostList } from '@/features/posts'
import { StreakLeaderboard } from '@/features/streaks'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Home Feed</h1>
            <p className="text-gray-600">Share your thoughts or tag a project with #</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <PostForm />
          </div>
          
          <div className="divide-y divide-gray-100">
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
