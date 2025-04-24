'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'
import Link from 'next/link'

interface UserStreak {
  username: string
  streak: number
  avatar_url: string | null
}

export function StreakLeaderboard() {
  const [streaks, setStreaks] = useState<UserStreak[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  const calculateStreaks = async () => {
    try {
      // Get all users with their posts
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')

      if (!profiles) return

      const userStreaks = await Promise.all(
        profiles.map(async (profile) => {
          const { data: posts } = await supabase
            .from('posts')
            .select('created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          let streak = 0
          
          if (posts?.length) {
            const today = startOfDay(new Date())
            const postDates = posts.map(post => startOfDay(parseISO(post.created_at)))
            const uniqueDates = [...new Set(postDates.map(date => date.toISOString()))]
              .map(dateStr => new Date(dateStr))
              .sort((a, b) => b.getTime() - a.getTime())

            let lastPostDate = uniqueDates[0]
            const daysSinceLastPost = differenceInDays(today, lastPostDate)

            // Streak is active if posted today or yesterday
            if (daysSinceLastPost <= 1) {
              streak = 1
              
              // Count consecutive days backwards
              for (let i = 1; i < uniqueDates.length; i++) {
                const currentDate = uniqueDates[i]
                const dayDiff = differenceInDays(lastPostDate, currentDate)
                
                if (dayDiff === 1) {
                  streak++
                  lastPostDate = currentDate
                } else {
                  break
                }
              }
            }
          }

          return {
            username: profile.username,
            streak,
            avatar_url: profile.avatar_url
          }
        })
      )

      // Sort by streak (highest first) and filter out zero streaks
      const sortedStreaks = userStreaks
        .filter(user => user.streak > 0)
        .sort((a, b) => b.streak - a.streak)

      setStreaks(sortedStreaks)
      setIsLoading(false)
    } catch (error) {
      console.error('Error calculating streaks:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    calculateStreaks()

    // Subscribe to new posts to update streaks
    const channel = supabase
      .channel('posts_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => {
          calculateStreaks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse text-gray-500 text-sm">
        Loading streaks...
      </div>
    )
  }

  if (streaks.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🔥 Streak Leaderboard</h2>
      <div className="space-y-3">
        {streaks.map((user, index) => (
          <div key={user.username} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 text-sm text-gray-500">#{index + 1}</div>
              <div className="flex items-center">
                <Link href={`/user/${user.username}`}>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-6 w-6 rounded-full mr-2 cursor-pointer"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-xs font-medium mr-2 cursor-pointer">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <Link 
                  href={`/user/${user.username}`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  {user.username}
                </Link>
              </div>
            </div>
            <div className="flex items-center text-orange-500">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-sm font-medium">{user.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 