'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  content: string
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
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
          profiles:profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .returns<Post[]>()

      if (error) {
        console.error('Error fetching posts:', error)
        return
      }

      setPosts(data || [])
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

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            {post.profiles.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.username}
                className="h-8 w-8 rounded-full mr-2"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-2" />
            )}
            <span className="font-medium">{post.profiles.username}</span>
          </div>
          <p className="text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  )
} 