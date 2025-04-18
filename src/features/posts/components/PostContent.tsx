'use client'

import Link from 'next/link'
import { useMemo } from 'react'

interface PostContentProps {
  content: string
  projectId?: string | null
  projectTitle?: string | null
  projectSlug?: string | null
}

export function PostContent({ content, projectId, projectTitle, projectSlug }: PostContentProps) {
  const renderedContent = useMemo(() => {
    if (!content) return ''

    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g

    // First handle project tag if present
    if (projectId && projectTitle && projectSlug) {
      const projectTag = `#${projectSlug}`
      const parts = content.split(projectTag)
      
      if (parts.length > 1) {
        return (
          <>
            {parts[0].split(urlPattern).map((part, i) => (
              urlPattern.test(part) ? (
                <a 
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {part}
                </a>
              ) : part
            ))}
            <Link
              href={`/projects/${projectSlug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {projectTag}
            </Link>
            {parts.slice(1).join(projectTag).split(urlPattern).map((part, i) => (
              urlPattern.test(part) ? (
                <a 
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {part}
                </a>
              ) : part
            ))}
          </>
        )
      }
    }

    // If no project tag, just handle URLs
    return (
      <>
        {content.split(urlPattern).map((part, i) => (
          urlPattern.test(part) ? (
            <a 
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {part}
            </a>
          ) : part
        ))}
      </>
    )
  }, [content, projectId, projectTitle, projectSlug])

  return (
    <p className="text-gray-800 whitespace-pre-wrap">
      {renderedContent}
    </p>
  )
} 