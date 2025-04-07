import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ProjectForm, ProjectList } from '@/features/projects'

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">Create and manage your projects</p>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200">
          <ProjectForm />
        </div>
        <ProjectList projects={projects || []} />
      </div>
    </div>
  )
} 