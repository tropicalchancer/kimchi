import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProjectList from '@/components/ProjectList'
import ProjectForm from '@/components/ProjectForm'

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        {session && <ProjectForm />}
      </div>
      <ProjectList />
    </div>
  )
} 