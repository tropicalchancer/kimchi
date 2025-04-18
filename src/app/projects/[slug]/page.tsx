import { ProjectPosts } from '@/features/projects'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@/lib/database.types'
import { ProjectActions } from './ProjectActions'

// Project emojis that represent different types of work
const PROJECT_EMOJIS = ['📝', '🎨', '💻', '📚', '🔧', '🎯', '⚡️', '🚀', '💡', '🛠️', '📊', '🎮', '🔬', '📱', '🎵']

function getProjectEmoji(title: string): string {
  // Use the project title's first character as a seed
  const seed = title.charCodeAt(0)
  return PROJECT_EMOJIS[seed % PROJECT_EMOJIS.length]
}

interface ProjectPageProps {
  params: { slug: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  // Get current session
  const { data: { session } } = await supabase.auth.getSession()

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

  const isOwner = session?.user?.id === project.user_id
  const projectEmoji = getProjectEmoji(project.title)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
                {projectEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">
                    {project.title}
                  </h1>
                  {isOwner && <ProjectActions project={project} />}
                </div>
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