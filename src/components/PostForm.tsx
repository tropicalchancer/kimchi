'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function PostForm() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw sessionError
      }
      
      if (!session) {
        console.error('No session found')
        throw new Error('Not authenticated')
      }

      console.log('Current user:', session.user)

      // Check if profile exists - don't use single() here
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw profileError
      }

      // Create profile if it doesn't exist
      if (!profiles || profiles.length === 0) {
        console.log('Creating new profile...')
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            full_name: session.user.email?.split('@')[0] || 'User',
            avatar_url: null
          }])

        if (createProfileError) {
          console.error('Profile creation error:', createProfileError)
          throw createProfileError
        }

        console.log('New profile created')
      }

      // Create post with user_id
      console.log('Creating post with:', { content, user_id: session.user.id })
      const { error: postError } = await supabase
        .from('posts')
        .insert([{ 
          content,
          user_id: session.user.id
        }])

      if (postError) {
        console.error('Post creation error:', postError)
        throw postError
      }

      console.log('Post created successfully')
      setContent('')
      router.refresh()
    } catch (err: unknown) {
      console.error('Detailed error:', err)
      setError(err instanceof Error ? err.message : 'Error creating post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
} 