import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskFeed } from "@/components/task-feed"

const demoUser = {
  name: 'Demo User',
  username: 'demo',
  taskCount: 42,
  streak: 31,
  projectCount: 3,
  projects: [
    {
      id: '1',
      name: 'Kimchi',
      description: 'A platform for makers to ship together'
    },
    {
      id: '2',
      name: 'Portfolio',
      description: 'My personal portfolio website'
    }
  ]
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{demoUser.name}</h1>
              <p className="text-muted-foreground">@{demoUser.username}</p>
            </div>
            <Button>Follow</Button>
          </div>
          <div className="flex gap-4 mt-4">
            <div>
              <div className="text-2xl font-bold">{demoUser.taskCount}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{demoUser.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{demoUser.projectCount}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {demoUser.projects.map((project) => (
            <Card key={project.id} className="p-4">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8">Recent Tasks</h2>
        <TaskFeed />
      </div>
    </div>
  )
}

