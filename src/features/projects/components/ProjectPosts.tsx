'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ProjectPostForm } from './ProjectPostForm'

interface ProjectPost {
  id: string
  content: string
  created_at: string
  user_id: string
  project_id: string
  profiles: {
    username: string
    avatar_url: string | null
  } | null
}

interface ProjectPostsProps {
  projectId: string
}

export function ProjectPosts({ projectId }: ProjectPostsProps) {
  const [posts, setPosts] = useState<ProjectPost[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          project_id,
          profiles!inner (
            username,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .returns<{
          id: string
          content: string
          created_at: string
          user_id: string
          project_id: string
          profiles: {
            username: string
            avatar_url: string | null
          }
        }[]>()

      if (error) {
        console.error('Error fetching project posts:', error)
        setError(error.message)
        return
      }

      setPosts(data || [])
      setError(null)
    }

    fetchPosts()

    const channel = supabase
      .channel('realtime posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router, projectId])

  return (
    <div>
      <ProjectPostForm projectId={projectId} />
      
      {error && (
        <div className="p-3 text-red-700 text-sm">
          Error loading posts: {error}
        </div>
      )}
      
      {!error && posts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No posts yet. Be the first to post in this project!
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center mb-4">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.username}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 mr-3 flex items-center justify-center text-gray-500 text-sm">
                    {post.profiles?.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.profiles?.username || 'Unknown User'}</div>
                </div>
              </div>
              <p className="text-gray-800">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 