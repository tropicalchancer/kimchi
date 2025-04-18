'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { PostgrestError } from '@supabase/supabase-js'
import { Modal } from '@/components/Modal'
import { ImageUpload } from '@/features/posts/components/ImageUpload'

interface ProfileFormProps {
  isOpen: boolean
  onClose: () => void
  profile: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
}

export function ProfileForm({ isOpen, onClose, profile }: ProfileFormProps) {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setFullName(profile.full_name)
      setAvatarUrl(profile.avatar_url)
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !fullName.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw new Error(sessionError.message)
      }
      
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Check if username is already taken (only if username changed)
      if (profile.username !== username.trim()) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username.trim())
          .single()

        if (existingProfile) {
          throw new Error('This username is already taken. Please choose a different one.')
        }
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          full_name: fullName.trim(),
          avatar_url: avatarUrl
        })
        .eq('id', profile.id)
        .eq('id', session.user.id) // Ensure user owns the profile

      if (profileError) throw profileError

      router.refresh()
      onClose()
    } catch (err: unknown) {
      console.error('Error saving profile:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else if ((err as PostgrestError)?.message) {
        setError((err as PostgrestError).message)
      } else {
        setError('Error saving profile')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setAvatarUrl(url)
    setError(null)
  }

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-base text-gray-900 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, ''))}
              placeholder="Enter username"
              className="block w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 border-0 bg-gray-50 focus:ring-0"
              required
              pattern="[a-z0-9]+"
              title="Only lowercase letters and numbers are allowed"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-base text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="block w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 border-0 bg-gray-50 focus:ring-0"
              required
            />
          </div>

          <div>
            <label className="block text-base text-gray-900 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D9361E] to-orange-400 flex items-center justify-center text-white text-xl font-medium">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
              <ImageUpload 
                onImageUploaded={handleImageUploaded} 
                onError={handleImageError}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-base text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !fullName.trim()}
            className="inline-flex items-center px-4 py-2 text-base text-white bg-[#D9361E] hover:bg-[#B22D19] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
} 