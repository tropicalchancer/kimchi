export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          user_id?: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          user_id: string
          project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          project_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 