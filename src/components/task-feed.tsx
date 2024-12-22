import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import type { Task } from "@/types"

const demoTasks: Task[] = [
  {
    id: '1',
    content: 'Launched my new portfolio website! #portfolio',
    imageUrl: '/placeholder.svg?height=400&width=600',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Sarah Chen',
      username: 'sarahchen',
    },
    project: {
      slug: 'portfolio',
      name: 'Portfolio'
    }
  },
  {
    id: '2',
    content: 'Added dark mode support to Kimchi 🌙 #kimchi',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      name: 'Alex Kim',
      username: 'alexkim',
    },
    project: {
      slug: 'kimchi',
      name: 'Kimchi'
    }
  },
  {
    id: '3',
    content: 'Fixed all reported bugs in the task creation flow',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    user: {
      name: 'Demo User',
      username: 'demo',
    }
  }
]

export function TaskFeed() {
  return (
    <div className="space-y-4">
      {demoTasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="mb-2">
            <Link href={`/${task.user.username}`} className="font-semibold hover:underline">
              {task.user.name}
            </Link>
          </div>
          <p className="whitespace-pre-wrap">{task.content}</p>
          {task.imageUrl && (
            <div className="mt-2 rounded-md overflow-hidden">
              <Image
                src={task.imageUrl}
                alt="Task image"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}
          {task.project && (
            <Link
              href={`/projects/${task.project.slug}`}
              className="inline-block mt-2 text-sm text-blue-500 hover:underline"
            >
              #{task.project.slug}
            </Link>
          )}
        </Card>
      ))}
    </div>
  )
}

