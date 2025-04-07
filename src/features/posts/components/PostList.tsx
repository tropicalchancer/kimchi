'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { PostContent } from './PostContent'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  id: string
  content: string
  created_at: string
  project_id: string | null
  projects: {
    id: string
    title: string
  } | null
  profiles: {
    username: string
    avatar_url: string | null
  }
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            created_at,
            project_id,
            projects (
              id,
              title
            ),
            profiles (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false })
          .returns<Post[]>()

        if (error) throw error
        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err instanceof Error ? err.message : 'Error fetching posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()

    const channel = supabase
      .channel('realtime posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  if (isLoading) {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse border-b border-gray-200 last:border-b-0">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gray-100 mr-3" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-700">
        {error}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="p-4 border-b border-gray-200 last:border-b-0">
          <div className="flex items-center mb-4">
            {post.profiles.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.username}
                className="h-8 w-8 rounded-full mr-3"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 mr-3 flex items-center justify-center text-gray-500 text-sm">
                {post.profiles.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900">{post.profiles.username}</div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="text-gray-900">
            <PostContent
              content={post.content}
              projectId={post.projects?.id}
              projectTitle={post.projects?.title}
            />
          </div>
        </div>
      ))}
    </div>
  )
} 