"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { auth } from "@/lib/auth" // We'll update this import later

export async function createTask(content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const supabase = createServerSupabaseClient()

  // Extract project hashtag if present
  const projectMatch = content.match(/#(\w+)/)
  let projectId: string | undefined

  if (projectMatch) {
    const projectSlug = projectMatch[1]
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', projectSlug)
      .single()
    
    if (project) {
      projectId = project.id
    }
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .insert([{
      content,
      user_id: session.user.id,
      project_id: projectId
    }])
    .select()
    .single()

  if (error) throw error

  revalidatePath("/")
  return task
}

export async function createProject(data: {
  name: string
  description?: string
  emoji?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const slug = data.name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")

  const supabase = createServerSupabaseClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert([{
      ...data,
      slug,
      user_id: session.user.id
    }])
    .select()
    .single()

  if (error) throw error

  revalidatePath("/projects")
  return project
}