export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export interface Post {
  id: string
  content: string
  user_id: string
  created_at: string
  profiles: Profile
}

export interface Project {
  id: string
  title: string
  description: string
  user_id: string
  created_at: string
  profiles: Profile
}

export interface ProjectPost {
  id: string
  content: string
  project_id: string
  user_id: string
  created_at: string
  profiles: Profile
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      posts: {
        Row: Omit<Post, 'profiles'>
        Insert: Omit<Post, 'id' | 'created_at' | 'profiles'>
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'profiles'>>
      }
      projects: {
        Row: Omit<Project, 'profiles'>
        Insert: Omit<Project, 'id' | 'created_at' | 'profiles'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'profiles'>>
      }
      project_posts: {
        Row: Omit<ProjectPost, 'profiles'>
        Insert: Omit<ProjectPost, 'id' | 'created_at' | 'profiles'>
        Update: Partial<Omit<ProjectPost, 'id' | 'created_at' | 'profiles'>>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: unknown
    }
  }
} 