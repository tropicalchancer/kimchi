'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import debounce from 'lodash/debounce'

export interface Project {
  id: string
  title: string
  description: string | null
}

export function useProjectSearch() {
  const [query, setQuery] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const searchProjects = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setProjects([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const { data, error: searchError } = await supabase
          .from('projects')
          .select('id, title, description')
          .ilike('title', `%${searchQuery}%`)
          .limit(5)

        if (searchError) {
          throw searchError
        }

        setProjects(data || [])
      } catch (err) {
        console.error('Error searching projects:', err)
        setError(err instanceof Error ? err.message : 'Error searching projects')
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [supabase]
  )

  useEffect(() => {
    searchProjects(query)
    return () => {
      searchProjects.cancel()
    }
  }, [query, searchProjects])

  return {
    query,
    setQuery,
    projects,
    isLoading,
    error
  }
} 