'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ImageUpload } from './ImageUpload'

export function PostForm() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth')
        return
      }

      // Extract project hashtag if present
      const projectMatch = content.match(/#(\w+)/)
      let projectId = null

      if (projectMatch) {
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', projectMatch[1])
          .single()
        
        if (project) {
          projectId = project.id
        }
      }

      const { error: insertError, data: newPost } = await supabase.from('posts').insert({
        content,
        user_id: session.user.id,
        project_id: projectId,
        image_url: imageUrl
      }).select(`
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
      `).single()

      if (insertError) throw insertError

      setContent('')
      setImageUrl(null)
      
      // Emit a custom event to notify PostList about the new post
      const customEvent = new CustomEvent('new-post', { detail: newPost })
      window.dispatchEvent(customEvent)
      
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
    setError(null)
  }

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="block w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        />
        
        <div className="flex items-center justify-between p-2 border-t border-gray-200">
          <ImageUpload 
            onImageUploaded={handleImageUploaded} 
            onError={handleImageError}
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="rounded-md bg-[#D9361E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#B32D19] disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {imageUrl && (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Upload preview" 
            className="max-h-64 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-900/50 text-white hover:bg-gray-900/75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  )
} 