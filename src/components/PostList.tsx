'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Post } from '@/types/database'

export default function PostList() {
  const [posts, setPosts] = useState<(Post & { profiles: { username: string; full_name: string; avatar_url: string | null } })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (data) {
        setPosts(data)
      }
      setIsLoading(false)
    }

    fetchPosts()
  }, [supabase])

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {post.profiles.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.full_name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.profiles.full_name}</span>
                <span className="text-gray-500">@{post.profiles.username}</span>
              </div>
              <p className="mt-1">{post.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No posts yet.
        </div>
      )}
    </div>
  )
} 