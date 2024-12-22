"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Image as IconImage, X } from "lucide-react" // Renamed here
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import NextImage from "next/image"

export function TaskForm() {
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  function handleImageSelect(file: File) {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageSelect(file)
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setErrorMessage("You need to be signed in to post tasks.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    try {
      // TODO: Implement with Supabase
      console.log("Task submitted:", { content, imageFile })
      setContent("")
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error(error)
      setErrorMessage("Failed to post task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-lg border bg-card p-4",
        isDragging && "border-primary"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Textarea
        placeholder={
          user
            ? "What did you ship? Use #project-name to link to a project"
            : "Sign in to post tasks"
        }
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setErrorMessage(null)
        }}
        className="mb-2"
        disabled={!user}
      />

      {errorMessage && (
        <div className="mb-2 text-sm text-red-500">
          {errorMessage}
        </div>
      )}

      {imagePreview ? (
        <div className="relative mb-2">
          <div className="relative w-auto max-h-[200px]">
            <NextImage
              src={imagePreview}
              alt="Task preview image"
              width={400}
              height={200}
              className="rounded-md object-contain"
            />
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={removeImage}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mb-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageSelect(file)
            }}
            disabled={!user}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={!user}
          >
            <IconImage className="mr-2 h-4 w-4" /> {/* Lucide icon, now renamed */}
            Add image
          </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={isLoading || !content || !user}>
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  )
}
