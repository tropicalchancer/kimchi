export type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export type Post = {
  id: string
  content: string
  user_id: string
  created_at: string
  project_id?: string | null
}

export type Project = {
  id: string
  name: string
  description: string
  user_id: string
  created_at: string
} 