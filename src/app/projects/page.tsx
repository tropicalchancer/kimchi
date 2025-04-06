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
    <div className="space-y-8">
      <ProjectForm />
      <ProjectList projects={projects || []} />
    </div>
  )
} 