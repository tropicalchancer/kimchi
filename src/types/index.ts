export type Task = {
    id: string
    content: string
    imageUrl?: string
    createdAt: string
    user: {
      name: string
      username: string
      image?: string
    }
    project?: {
      slug: string
      name: string
    }
  }
  
  export type Project = {
    id: string
    name: string
    slug: string
    description?: string
    emoji?: string
    createdAt: string
    userId: string
  }
  
  export type User = {
    id: string
    name: string
    username: string
    email: string
    image?: string
    streak: number
    taskCount: number
    projectCount: number
  }
  
  