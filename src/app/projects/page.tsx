'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ProjectForm, ProjectList } from '@/features/projects'

export default function ProjectsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#D9361E] hover:bg-[#B22D19] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E]"
        >
          Add Project
        </button>
      </div>

      <ProjectForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProjectList />
    </div>
  )
} 