'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import type { Database } from '../../../lib/database.types'

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  async function fetchProjects() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })

      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()

    // Subscribe to changes
    const channel = supabase
      .channel('projects_realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'projects'
      }, async (payload) => {
        // Fetch the complete project with profile data
        const { data: newProject } = await supabase
          .from('projects')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single()

        if (newProject) {
          setProjects(currentProjects => [newProject, ...currentProjects])
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects'
      }, async (payload) => {
        // Fetch the updated project with profile data
        const { data: updatedProject } = await supabase
          .from('projects')
          .select('*, profiles(*)')
          .eq('id', payload.new.id)
          .single()

        if (updatedProject) {
          setProjects(currentProjects =>
            currentProjects.map(project =>
              project.id === updatedProject.id ? updatedProject : project
            )
          )
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'projects'
      }, (payload) => {
        setProjects(currentProjects =>
          currentProjects.filter(project => project.id !== payload.old.id)
        )
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-500">
        Loading projects...
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No projects yet. Create your first project!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E] rounded-lg"
        >
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">
              {project.title}
            </h3>
            <p className="mt-2 text-gray-600">
              {project.description}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>Created by {project.profiles?.full_name || 'Anonymous'}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 