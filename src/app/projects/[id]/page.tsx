import { ProjectPosts } from '@/features/projects'

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <ProjectPosts projectId={params.id} />
    </div>
  )
} 