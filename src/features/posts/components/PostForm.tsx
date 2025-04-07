'use client'

import { useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ProjectAutocomplete } from '@/features/projects/components/ProjectAutocomplete'
import type { Project } from '@/features/projects/hooks/useProjectSearch'

export function PostForm() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProjectAutocomplete, setShowProjectAutocomplete] = useState(false)
  const [projectSearchText, setProjectSearchText] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Check if we should show project autocomplete
    const lastChar = newContent.slice(-1)
    const prevChar = newContent.slice(-2, -1)

    if (lastChar === '#' && prevChar !== '#') {
      setShowProjectAutocomplete(true)
      setProjectSearchText('')
    } else if (showProjectAutocomplete) {
      const hashIndex = newContent.lastIndexOf('#')
      if (hashIndex === -1) {
        setShowProjectAutocomplete(false)
      } else {
        const searchText = newContent.slice(hashIndex + 1)
        setProjectSearchText(searchText)
      }
    }
  }, [showProjectAutocomplete])

  const handleProjectSelect = useCallback((project: Project) => {
    const hashIndex = content.lastIndexOf('#')
    const newContent = content.slice(0, hashIndex) + `#${project.title} `
    setContent(newContent)
    setSelectedProject(project)
    setShowProjectAutocomplete(false)
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw new Error(sessionError.message)
      }
      
      if (!session) {
        throw new Error('Not authenticated')
      }

      // First check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Profile not found. Please try logging out and back in.')
      }

      // Add checkmark emoji to the beginning of the content
      const contentWithCheckmark = `✅ ${content.trim()}`

      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content: contentWithCheckmark,
          user_id: session.user.id,
          project_id: selectedProject?.id || null
        })

      if (postError) {
        console.error('Post error:', postError)
        throw new Error(postError.message)
      }

      setContent('')
      setSelectedProject(null)
      router.refresh()
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Error creating post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {error && (
        <div className="mb-4 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="relative">
        <div className="relative">
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="What did you get done?"
            rows={3}
            className="block w-full border-0 pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 resize-none"
            required
          />
          <div className="absolute left-4 top-3 text-gray-400 pointer-events-none">
            ✅
          </div>
        </div>
        {showProjectAutocomplete && (
          <div className="absolute left-0 right-0 mt-1 z-10">
            <ProjectAutocomplete
              isOpen={showProjectAutocomplete}
              searchText={projectSearchText}
              onSelect={handleProjectSelect}
              onClose={() => setShowProjectAutocomplete(false)}
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 min-h-[2rem]">
          {selectedProject && (
            <div className="flex items-center space-x-2 text-blue-600 text-sm">
              <span>#{selectedProject.title}</span>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Posting...
            </>
          ) : (
            'Post'
          )}
        </button>
      </div>
    </form>
  )
} 