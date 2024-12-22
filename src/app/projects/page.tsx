import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import Link from "next/link"

const demoProjects = [
  {
    id: '1',
    name: 'Kimchi',
    slug: 'kimchi',
    description: 'A platform for makers to ship together',
    emoji: '🌶️'
  },
  {
    id: '2',
    name: 'Portfolio',
    slug: 'portfolio',
    description: 'My personal portfolio website',
    emoji: '🎨'
  },
  {
    id: '3',
    name: 'Task Manager',
    slug: 'task-manager',
    description: 'Simple task management app',
    emoji: '✅'
  }
]

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demoProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <Card className="p-4 hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                <span className="text-2xl">{project.emoji}</span>
                {project.name}
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

