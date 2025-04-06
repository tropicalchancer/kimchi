'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { PostgrestError } from '@supabase/supabase-js'

export function ProjectForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // First check if we can query the table structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('projects')
        .select('*')
        .limit(1)

      if (tableError) {
        console.error('Table structure error:', tableError)
        throw new Error(`Table error: ${tableError.message}`)
      }

      console.log('Current table structure:', tableInfo)

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error(sessionError.message)
      }
      
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Log the exact data we're trying to insert
      const projectData = {
        title,
        description,
        user_id: session.user.id
      }
      console.log('Attempting to insert:', projectData)

      const { data: insertedData, error: projectError } = await supabase
        .from('projects')
        .insert([projectData])
        .select()

      if (projectError) {
        console.error('Project error:', projectError)
        throw new Error(projectError.message)
      }

      console.log('Successfully inserted:', insertedData)

      setTitle('')
      setDescription('')
      router.refresh()
    } catch (err: unknown) {
      console.error('Detailed error:', err)
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  )
} 