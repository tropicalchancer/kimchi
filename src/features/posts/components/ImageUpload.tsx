'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onError: (error: string) => void
}

export function ImageUpload({ onImageUploaded, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClientComponentClient()

  const handleFile = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('Image must be less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      onImageUploaded(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      onError('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <button
        type="button"
        disabled={isUploading}
        className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span>{isUploading ? 'Uploading...' : 'Add photo'}</span>
      </button>
    </div>
  )
} 