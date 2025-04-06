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

      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-4 relative">
        <label htmlFor="content" className="sr-only">
          What's on your mind?
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind? Use # to tag a project"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {showProjectAutocomplete && (
          <ProjectAutocomplete
            isOpen={showProjectAutocomplete}
            searchText={projectSearchText}
            onSelect={handleProjectSelect}
            onClose={() => setShowProjectAutocomplete(false)}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        {selectedProject && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Project:</span>
            <span className="text-sm font-medium text-blue-600">
              {selectedProject.title}
            </span>
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
        )}
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