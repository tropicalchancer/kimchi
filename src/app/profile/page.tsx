'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/api/supabase/client'
import { Post, Profile, Project } from '@/shared/types/database'
import { formatDistanceToNow } from 'date-fns'
import { ProfileActions } from '@/features/profile/components/ProfileActions'
import { ActivityGraph } from '@/features/profile/components/ActivityGraph'

interface ExtendedPost extends Post {
  image_url?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<ExtendedPost[]>([])
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
      if (!session?.user?.id) return
      
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          Profile not found. Please try logging out and back in.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D9361E] to-orange-400 flex items-center justify-center text-white text-3xl font-medium border-4 border-gray-50 shadow-sm">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.full_name}
                </h1>
                <ProfileActions profile={profile} />
              </div>
              <p className="text-gray-600 mb-3">@{profile.username}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Graph */}
      <div className="mb-6">
        <ActivityGraph userId={profile.id} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projects Column */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            </div>
            <div className="p-4">
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <a
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Column */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            </div>
            <div>
              {posts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4">
                      <div className="mb-2">
                        <time className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </time>
                      </div>
                      <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
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
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No posts yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 