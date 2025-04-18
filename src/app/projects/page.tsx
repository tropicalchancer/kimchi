'use client'

import { useState } from 'react'
import { ProjectForm, ProjectList } from '@/features/projects'

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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