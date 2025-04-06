'use client'

import Link from 'next/link'
import { useMemo } from 'react'

interface PostContentProps {
  content: string
  projectId?: string | null
  projectTitle?: string | null
}

export function PostContent({ content, projectId, projectTitle }: PostContentProps) {
  const renderedContent = useMemo(() => {
    if (!content) return ''

    // If we have a linked project, make it clickable
    if (projectId && projectTitle) {
      const projectTag = `#${projectTitle}`
      const parts = content.split(projectTag)
      
      if (parts.length > 1) {
        return (
          <>
            {parts[0]}
            <Link
              href={`/projects/${projectId}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {projectTag}
            </Link>
            {parts.slice(1).join(projectTag)}
          </>
        )
      }
    }

    return content
  }, [content, projectId, projectTitle])

  return <p className="text-gray-800">{renderedContent}</p>
} 