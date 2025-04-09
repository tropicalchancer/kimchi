'use client'

import Link from 'next/link'
import { Project } from '@/shared/types/database'
import { formatDistanceToNow } from 'date-fns'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="p-4 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
      </div>
    )
  }

  return (
    <div>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="block p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
        >
          <div className="flex items-center mb-4">
            {project.profiles.avatar_url ? (
              <img
                src={project.profiles.avatar_url}
                alt={project.profiles.username}
                className="h-8 w-8 rounded-full mr-3"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100 mr-3 flex items-center justify-center text-gray-500 text-sm">
                {project.profiles.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {project.profiles.username}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-gray-600 line-clamp-3">{project.description}</p>

          <div className="mt-4 flex items-center text-sm text-[#D9361E]">
            <span>View project</span>
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
} 