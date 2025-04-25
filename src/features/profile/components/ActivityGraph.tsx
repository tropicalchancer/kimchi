import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { startOfYear, eachDayOfInterval, format, parseISO, startOfDay, subYears } from 'date-fns'

interface ActivityGraphProps {
  userId: string
}

interface DayActivity {
  date: string
  count: number
}

export function ActivityGraph({ userId }: ActivityGraphProps) {
  const [activityData, setActivityData] = useState<DayActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        // Get posts from the last year
        const startDate = subYears(new Date(), 1)
        const { data: posts } = await supabase
          .from('posts')
          .select('created_at')
          .eq('user_id', userId)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true })

        if (!posts) {
          setActivityData([])
          return
        }

        // Generate all days in the year
        const today = new Date()
        const allDays = eachDayOfInterval({ start: startDate, end: today })
        
        // Count posts per day
        const postsByDay = posts.reduce<Record<string, number>>((acc, post) => {
          const day = format(parseISO(post.created_at), 'yyyy-MM-dd')
          acc[day] = (acc[day] || 0) + 1
          return acc
        }, {})

        // Create activity data array
        const activity = allDays.map(day => ({
          date: format(day, 'yyyy-MM-dd'),
          count: postsByDay[format(day, 'yyyy-MM-dd')] || 0
        }))

        setActivityData(activity)
      } catch (error) {
        console.error('Error fetching activity data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [userId, supabase])

  if (loading) {
    return <div className="animate-pulse h-24 bg-gray-100 rounded-lg"></div>
  }

  // Calculate the maximum activity for a day to determine color intensity
  const maxActivity = Math.max(...activityData.map(day => day.count))
  
  // Function to determine the color based on activity count
  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    const intensity = Math.ceil((count / maxActivity) * 4) // 4 levels of intensity
    switch (intensity) {
      case 1: return 'bg-green-200'
      case 2: return 'bg-green-300'
      case 3: return 'bg-green-400'
      case 4: return 'bg-green-500'
      default: return 'bg-gray-100'
    }
  }

  // Group days into weeks
  const weeks: DayActivity[][] = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-base font-medium text-gray-900 mb-4">Activity</h3>
      <div className="w-full overflow-x-auto">
        <div className="inline-flex gap-[3px] min-w-full">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-2.5 h-2.5 rounded-sm ${getActivityColor(day.count)}`}
                  title={`${format(parseISO(day.date), 'MMM d, yyyy')}: ${day.count} tasks`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 