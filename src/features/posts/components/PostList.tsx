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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 mr-3" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
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
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        {error}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            {post.profiles.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.username}
                className="h-10 w-10 rounded-full mr-3 border-2 border-white shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mr-3 flex items-center justify-center text-blue-600 font-medium border-2 border-white shadow-sm">
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
          <div className="prose prose-blue max-w-none">
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