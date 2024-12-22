import { Card } from "@/components/ui/card"
import Link from "next/link"

const demoUsers = [
  { id: '1', name: 'Sarah Chen', username: 'sarahchen', streak: 42 },
  { id: '2', name: 'Alex Kim', username: 'alexkim', streak: 38 },
  { id: '3', name: 'Demo User', username: 'demo', streak: 31 },
  { id: '4', name: 'Maria Garcia', username: 'maria', streak: 28 },
  { id: '5', name: 'John Smith', username: 'johnsmith', streak: 25 },
]

export function StreakLeaderboard() {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">🔥 Streak Leaderboard</h2>
      <div className="space-y-4">
        {demoUsers.map((user, i) => (
          <div key={user.id} className="flex items-center gap-4">
            <div className="text-muted-foreground">{i + 1}</div>
            <div className="flex-1">
              <Link href={`/${user.username}`} className="font-medium hover:underline">
                {user.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {user.streak} day streak
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

