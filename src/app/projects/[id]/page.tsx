import { ProjectPosts } from '@/features/projects'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-4 mb-6">
            {project.profiles.avatar_url ? (
              <img
                src={project.profiles.avatar_url}
                alt={project.profiles.username}
                className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium border-2 border-white shadow-sm">
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
        
        <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>Posts</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Updates</h2>
        <ProjectPosts projectId={params.id} />
      </div>
    </div>
  )
} 