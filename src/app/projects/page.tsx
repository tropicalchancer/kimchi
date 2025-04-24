'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ProjectForm, ProjectList } from '@/features/projects'
import type { Database } from '@/lib/database.types'

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

export default function ProjectsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const supabase = createClientComponentClient<Database>()

  // Fetch initial projects
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      console.log('Fetched projects:', data)
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [supabase])

  // Check authentication and load initial data
  useEffect(() => {
    const checkUserAndLoadProjects = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          router.push('/auth')
          return
        }
        
        if (!session) {
          console.log('No session found, redirecting to auth')
          router.push('/auth')
          return
        }

        console.log('User authenticated, fetching projects')
        await fetchProjects()
      } catch (error) {
        console.error('Error in initialization:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUserAndLoadProjects()
  }, [router, supabase, fetchProjects])

  const handleProjectCreated = useCallback(async (newProject: Project) => {
    console.log('Project created, updating state:', newProject)
    setProjects(prev => {
      // Check if project already exists
      if (prev.some(p => p.id === newProject.id)) {
        return prev
      }
      return [newProject, ...prev]
    })
  }, [])

  const handleProjectsChange = useCallback((updatedProjects: Project[]) => {
    console.log('Projects updated:', updatedProjects)
    setProjects(updatedProjects)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#D9361E] hover:bg-[#B22D19] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E]"
        >
          Add Project
        </button>
      </div>

      <ProjectForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={handleProjectCreated}
      />
      <ProjectList 
        initialProjects={projects} 
        onProjectsChange={handleProjectsChange}
      />
    </div>
  )
} 