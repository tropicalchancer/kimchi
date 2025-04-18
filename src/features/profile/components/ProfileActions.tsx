'use client'

import { useState } from 'react'
import { ProfileForm } from './ProfileForm'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

interface ProfileActionsProps {
  profile: Profile
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="ml-4 inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E]"
      >
        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>

      <ProfileForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          router.refresh() // Refresh the page data after editing
        }}
        profile={profile}
      />
    </>
  )
} 