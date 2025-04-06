'use client'

import Link from 'next/link'
import { Project } from '@/shared/types/database'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
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