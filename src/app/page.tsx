import { TaskForm } from "@/components/task-form"
import { TaskFeed } from "@/components/task-feed"
import { StreakLeaderboard } from "@/components/streak-leaderboard"

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <TaskForm />
        <TaskFeed />
      </div>
      <div>
        <StreakLeaderboard />
      </div>
    </div>
  )
}

