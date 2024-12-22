"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import Link from "next/link"
import { User, Settings, Ticket, CreditCard, LogOut } from 'lucide-react'

export function UserMenu() {
  const { user } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    const supabase = createClientSupabaseClient()
    await supabase.auth.signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center gap-3 px-2 py-3 h-auto justify-start hover:bg-accent rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback>{user.user_metadata.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">@{user.user_metadata.user_name || user.user_metadata.full_name}</span>
            <span className="text-xs text-muted-foreground">Open menu</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuItem asChild>
          <Link href={`/profile`} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/invites" className="flex items-center">
            <Ticket className="mr-2 h-4 w-4" />
            Invites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

