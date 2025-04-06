import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Project } from '@/types/database'
import Link from 'next/link'

export default async function ProjectList() {
  const supabase = createServerComponentClient({ cookies })

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:user_id (
        username,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((project: Project & { profiles: { username: string; full_name: string } }) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-gray-600 mt-2">{project.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>By {project.profiles.full_name}</span>
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  )
} 