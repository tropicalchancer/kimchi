import { ProjectPosts } from '@/features/projects'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:profiles (
        username,
        avatar_url
      )
    `)
    .eq('id', params.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          {project.profiles.avatar_url ? (
            <img
              src={project.profiles.avatar_url}
              alt={project.profiles.username}
              className="h-10 w-10 rounded-full mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-sm text-gray-500">Created by {project.profiles.username}</p>
          </div>
        </div>
        <p className="text-gray-700">{project.description}</p>
      </div>
      
      <ProjectPosts projectId={params.id} />
    </div>
  )
} 