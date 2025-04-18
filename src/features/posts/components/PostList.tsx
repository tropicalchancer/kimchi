'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { formatDistanceToNow } from 'date-fns'
import { PostContent } from './PostContent'

interface Profile {
  username: string
  avatar_url: string | null
}

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
  project_id: string | null
  image_url: string | null
  profiles: Profile
  projects: {
    id: string
    title: string
    slug: string
  } | null
}

// Add custom event type
interface NewPostEvent extends CustomEvent {
  detail: Post
}

interface PostgresInsertPayload {
  new: {
    id: string
    content: string
    created_at: string
    user_id: string
    project_id: string | null
    image_url: string | null
  }
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (
              username,
              avatar_url
            ),
            projects (
              id,
              title,
              slug
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Handle custom event for new posts
    const handleNewPost = (event: NewPostEvent) => {
      const newPost = event.detail
      setPosts(prevPosts => [newPost, ...prevPosts])
    }

    window.addEventListener('new-post', handleNewPost as EventListener)

    // Subscribe to real-time updates
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, async (payload: PostgresInsertPayload) => {
        // Only fetch if it's not our own post (handled by custom event)
        const customEventPost = payload.new.id
        if (!posts.some(post => post.id === customEventPost)) {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              profiles (
                username,
                avatar_url
              ),
              projects (
                id,
                title,
                slug
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            setPosts(prevPosts => [data, ...prevPosts])
          }
        }
      })
      .subscribe()

    return () => {
      window.removeEventListener('new-post', handleNewPost as EventListener)
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (loading) {
    return <div className="p-4">Loading posts...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  if (posts.length === 0) {
    return <div className="p-4 text-gray-500">No posts yet. Be the first to post!</div>
  }

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <div key={post.id} className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {post.profiles.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.username}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {post.profiles.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {post.profiles.username}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
              <div className="mt-1">
                <PostContent 
                  content={post.content}
                  projectId={post.projects?.id}
                  projectTitle={post.projects?.title}
                  projectSlug={post.projects?.slug}
                />
              </div>
              {post.image_url && (
                <div className="mt-3">
                  <img
                    src={post.image_url}
                    alt="Post attachment"
                    className="rounded-lg max-h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 