'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { PostgrestError } from '@supabase/supabase-js'

export function ProjectForm() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !slug.trim()) return

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

      // Check if slug is already taken
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug.trim())
        .single()

      if (existingProject) {
        throw new Error('This URL is already taken. Please choose a different one.')
      }

      const { error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          user_id: session.user.id
        }])
        .select()

      if (projectError) throw projectError

      setTitle('')
      setSlug('')
      setDescription('')
      router.refresh()
    } catch (err: unknown) {
      console.error('Error creating project:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else if ((err as PostgrestError)?.message) {
        setError((err as PostgrestError).message)
      } else {
        setError('Error creating project')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Only auto-generate slug if user hasn't manually edited it
    if (!slug || slug === newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {error && (
        <div className="mb-4 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter project title"
            className="block w-full border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 resize-none"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Project URL
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 px-4 py-3">/projects/</span>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
              placeholder="project-url"
              className="block w-full border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 resize-none"
              required
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens are allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            rows={4}
            className="block w-full border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 resize-none"
            required
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setTitle('')
            setSlug('')
            setDescription('')
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
          disabled={isSubmitting || (!title && !description)}
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim() || !slug.trim()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#D9361E] hover:bg-[#B22D19] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </>
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </form>
  )
} 