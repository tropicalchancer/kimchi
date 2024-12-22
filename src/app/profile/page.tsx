import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TaskFeed } from "@/components/task-feed"

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session.user
  const { user_metadata } = user

  return (
    <div className="space-y-6">
      <Card>
        <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-background -mt-12">
              <AvatarImage src={user_metadata.avatar_url} />
              <AvatarFallback>{user_metadata.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user_metadata.full_name}</h1>
              <p className="text-muted-foreground">@{user_metadata.user_name || user_metadata.full_name}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
          <div className="flex gap-4 mt-4">
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-4">
          <TaskFeed />
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <div className="text-center text-muted-foreground py-8">
            No projects yet
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

