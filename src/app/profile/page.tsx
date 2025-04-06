'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/api/supabase/client'
import { Post, Profile, Project } from '@/shared/types/database'
import { PostList } from '@/features/posts'
import { ProjectList } from '@/features/projects'

export default function ProfilePage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionLoading) return

    if (!session?.user) {
      router.push('/auth')
      return
    }

    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Load user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, profiles(*)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (postsError) throw postsError
        setPosts(postsData)

        // Load user's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*, profiles(*)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (projectsError) throw projectsError
        setProjects(projectsData)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError(err instanceof Error ? err.message : 'Error loading profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session, router, sessionLoading])

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        Profile not found. Please try logging out and back in.
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-20 h-20 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-600">@{profile.username}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <p className="text-gray-500">No projects yet</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <p className="text-gray-500">No posts yet</p>
          )}
        </div>
      </div>
    </div>
  )
} 