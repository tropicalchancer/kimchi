'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { differenceInDays, isYesterday, isToday, parseISO } from 'date-fns'

export function StreakDisplay() {
  const [streak, setStreak] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function calculateStreak() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // Get user's posts ordered by date
      const { data: posts } = await supabase
        .from('posts')
        .select('created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!posts?.length) return

      let currentStreak = 0
      let lastPostDate = parseISO(posts[0].created_at)

      // If the last post was today or yesterday, we have an active streak
      if (isToday(lastPostDate) || isYesterday(lastPostDate)) {
        currentStreak = 1
        
        // Count consecutive days backwards
        for (let i = 1; i < posts.length; i++) {
          const currentDate = parseISO(posts[i].created_at)
          const dayDiff = differenceInDays(lastPostDate, currentDate)
          
          if (dayDiff === 1) {
            currentStreak++
            lastPostDate = currentDate
          } else {
            break
          }
        }
      }

      setStreak(currentStreak)
    }

    calculateStreak()
  }, [])

  if (streak === 0) return null

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center text-orange-500">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span className="ml-1 font-medium">{streak} day streak!</span>
      </div>
    </div>
  )
} 