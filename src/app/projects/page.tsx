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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">Create and manage your projects</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ProjectForm />
        </div>
        
        <div>
          <ProjectList projects={projects || []} />
        </div>
      </div>
    </div>
  )
} 