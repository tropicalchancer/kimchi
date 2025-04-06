import { ProjectForm, ProjectList } from '@/features/projects'

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <ProjectForm />
      <ProjectList />
    </div>
  )
} 