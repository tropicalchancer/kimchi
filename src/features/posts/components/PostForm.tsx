'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImageUpload } from './ImageUpload'
import { v4 as uuidv4 } from 'uuid'

interface ProjectSuggestion {
  id: string
  title: string
  slug: string
  user_id: string
}

export function PostForm() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectSuggestions, setProjectSuggestions] = useState<ProjectSuggestion[]>([])
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProjectSuggestions = async () => {
      if (!content || cursorPosition === null) {
        setProjectSuggestions([])
        return
      }

      // Get the word being typed after #
      const beforeCursor = content.slice(0, cursorPosition)
      const hashtagMatch = beforeCursor.match(/#([\w-]*)$/)
      
      if (!hashtagMatch) {
        setProjectSuggestions([])
        return
      }

      const searchTerm = hashtagMatch[1].toLowerCase()
      
      if (searchTerm) {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setProjectSuggestions([])
          return
        }

        const { data } = await supabase
          .from('projects')
          .select('id, title, slug, user_id')
          .eq('user_id', session.user.id)
          .or(`title.ilike.${searchTerm}%,slug.ilike.${searchTerm}%`)
          .limit(5)

        // Additional safety check to ensure only user's projects are shown
        const filteredData = data?.filter(project => project.user_id === session.user.id) || []
        setProjectSuggestions(filteredData)
      } else {
        setProjectSuggestions([])
      }
    }

    fetchProjectSuggestions()
  }, [content, cursorPosition, supabase])

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

      // Extract project hashtag if present - look for the last hashtag
      const projectMatches = Array.from(content.matchAll(/#([\w-]+)/g))
      let projectId = null

      if (projectMatches.length > 0) {
        const lastMatch = projectMatches[projectMatches.length - 1]
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', lastMatch[1])
          .eq('user_id', session.user.id)
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    // Only set isDragging to false if we've actually left the element
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      try {
        // Upload image to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)

        setImageUrl(publicUrl)
        setError(null)
      } catch (error) {
        console.error('Error uploading image:', error)
        setError('Failed to upload image')
      }
    } else if (file) {
      setError('Please drop an image file')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div 
        className={`rounded-lg border border-gray-200 relative ${
          isDragging ? 'border-2 border-dashed border-gray-300 bg-gray-50' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10">
            <div className="text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Drop image here
            </div>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement
            setCursorPosition(target.selectionStart)
          }}
          placeholder="✅ What did you get done?"
          rows={3}
          className="block w-full resize-none border-0 bg-transparent p-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        />
        
        {projectSuggestions.length > 0 && (
          <div className="absolute mt-2 inset-x-0 z-10">
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden mx-4">
              <div className="py-2">
                {projectSuggestions.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      if (cursorPosition === null) return
                      
                      const beforeCursor = content.slice(0, cursorPosition)
                      const afterCursor = content.slice(cursorPosition)
                      
                      // Replace the partial hashtag with the full project slug
                      const newContent = beforeCursor.replace(/#[^#\s]*$/, `#${project.slug}`) + afterCursor
                      
                      setContent(newContent)
                      setProjectSuggestions([])
                    }}
                  >
                    <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                      {project.title[0].toUpperCase()}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">#{project.slug}</div>
                    </div>
                    <div className="ml-2">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          </div>
        )}
        
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
          <Image 
            src={imageUrl} 
            alt="Upload preview" 
            width={400}
            height={300}
            className="max-h-64 rounded-lg object-cover w-full"
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