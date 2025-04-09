import { ProjectPosts } from '@/features/projects'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
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
    .eq('slug', params.slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              {project.profiles.avatar_url ? (
                <img
                  src={project.profiles.avatar_url}
                  alt={project.profiles.username}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                  {project.profiles.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">
                  {project.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Created by {project.profiles.username}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={project.created_at}>
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </time>
                </div>
              </div>
            </div>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>
        </div>
        
        <div>
          <ProjectPosts projectId={project.id} />
        </div>
      </div>
    </div>
  )
} 