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
  
      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200">
          <ProjectForm />
        </div>
        <ProjectList projects={projects || []} />
      </div>
    </div>
  )
} 