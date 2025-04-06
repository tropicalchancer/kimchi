'use client'

import { useEffect, useRef } from 'react'
import { useProjectSearch, Project } from '../hooks/useProjectSearch'

interface ProjectAutocompleteProps {
  isOpen: boolean
  searchText: string
  onSelect: (project: Project) => void
  onClose: () => void
}

export function ProjectAutocomplete({
  isOpen,
  searchText,
  onSelect,
  onClose
}: ProjectAutocompleteProps) {
  const { projects, isLoading, error, setQuery } = useProjectSearch()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(searchText)
  }, [searchText, setQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      {isLoading ? (
        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="px-4 py-2 text-sm text-red-500">{error}</div>
      ) : projects.length === 0 ? (
        <div className="px-4 py-2 text-sm text-gray-500">No projects found</div>
      ) : (
        projects.map((project) => (
          <button
            key={project.id}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            onClick={() => onSelect(project)}
          >
            <div className="font-medium text-gray-900">{project.title}</div>
            {project.description && (
              <div className="mt-1 text-xs text-gray-500 truncate">
                {project.description}
              </div>
            )}
          </button>
        ))
      )}
    </div>
  )
} 