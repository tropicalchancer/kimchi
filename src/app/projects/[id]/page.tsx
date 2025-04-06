import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ProjectPosts from '@/components/ProjectPosts'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name
      )
    `)
    .eq('id', params.id)
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          Created by {project.profiles.full_name} on{' '}
          {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>
      <ProjectPosts projectId={params.id} />
    </div>
  )
} 