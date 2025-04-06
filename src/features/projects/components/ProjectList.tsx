'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  created_at: string
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Project[]>()

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      setProjects(data || [])
    }

    fetchProjects()
  }, [supabase, router])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </Link>
      ))}
    </div>
  )
} 