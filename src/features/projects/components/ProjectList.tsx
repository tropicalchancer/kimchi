'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { format, isToday, isYesterday, isSameYear } from 'date-fns'
import type { Database } from '../../../lib/database.types'

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

// Pastel background colors for project cards
const BACKGROUND_COLORS = [
  'bg-green-50',
  'bg-blue-50',
  'bg-purple-50',
  'bg-pink-50',
  'bg-yellow-50',
  'bg-indigo-50',
]

function getBackgroundColor(index: number): string {
  return BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]
}

function formatDate(date: string): string {
  const projectDate = new Date(date)
  if (isToday(projectDate)) {
    return 'Today'
  }
  if (isYesterday(projectDate)) {
    return 'Yesterday'
  }
  if (isSameYear(projectDate, new Date())) {
    return format(projectDate, 'MMMM d')
  }
  return format(projectDate, 'MMMM d, yyyy')
}

function groupProjectsByDate(projects: Project[]): { [key: string]: Project[] } {
  const grouped: { [key: string]: Project[] } = {}
  
  projects.forEach(project => {
    const dateKey = formatDate(project.created_at)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(project)
  })
  
  return grouped
}

interface ProjectListProps {
  initialProjects?: Project[]
  onProjectsChange?: (projects: Project[]) => void
}

export function ProjectList({ initialProjects = [], onProjectsChange }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isLoading, setIsLoading] = useState(!initialProjects.length)
  const supabase = createClientComponentClient<Database>()

  // Update local state when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const updateProjects = useCallback((newProjects: Project[] | ((prev: Project[]) => Project[])) => {
    setProjects(prev => {
      const nextProjects = typeof newProjects === 'function' ? newProjects(prev) : newProjects
      onProjectsChange?.(nextProjects)
      return nextProjects
    })
  }, [onProjectsChange])

  async function fetchProjects() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })

      if (data) {
        updateProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up realtime subscription
  useEffect(() => {
    // Only fetch if we don't have initial projects
    if (!initialProjects.length) {
      fetchProjects()
    }

    // Set up realtime subscription
    const channel = supabase
      .channel('projects_realtime')
      .on('postgres_changes', {
        event: '*', // Listen to all events
        schema: 'public',
        table: 'projects'
      }, async (payload) => {
        console.log('Received realtime event:', payload)
        
        // Handle the event based on its type
        if (payload.eventType === 'INSERT') {
          const { data: newProject } = await supabase
            .from('projects')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single()

          if (newProject) {
            updateProjects(current => {
              // Check if project already exists to prevent duplicates
              if (current.some(p => p.id === newProject.id)) {
                return current
              }
              return [newProject, ...current]
            })
          }
        } else if (payload.eventType === 'UPDATE') {
          const { data: updatedProject } = await supabase
            .from('projects')
            .select('*, profiles(*)')
            .eq('id', payload.new.id)
            .single()

          if (updatedProject) {
            updateProjects(current =>
              current.map(project =>
                project.id === updatedProject.id ? updatedProject : project
              )
            )
          }
        } else if (payload.eventType === 'DELETE') {
          updateProjects(current =>
            current.filter(project => project.id !== payload.old.id)
          )
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      console.log('Cleaning up realtime subscription')
      supabase.removeChannel(channel)
    }
  }, [supabase, updateProjects, initialProjects.length]) // Only depend on initialProjects.length

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

  const groupedProjects = groupProjectsByDate(projects)

  return (
    <div className="space-y-8">
      {Object.entries(groupedProjects).map(([date, dateProjects], groupIndex) => (
        <div key={date} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
          <div className="space-y-4">
            {dateProjects.map((project, projectIndex) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E] rounded-lg"
              >
                <div className={`shadow rounded-lg p-6 ${getBackgroundColor(groupIndex + projectIndex)}`}>
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
        </div>
      ))}
    </div>
  )
} 