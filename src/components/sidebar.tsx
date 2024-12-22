import Link from "next/link"
import { Home, FolderKanban, Bell, Trophy } from 'lucide-react'
import { UserMenu } from "@/components/user-menu"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/streaks", label: "Streaks", icon: Trophy },
]

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-background p-4 flex flex-col h-full">
      <Link
        href="/"
        className="flex items-center gap-2 px-2 py-1.5 mb-4 font-semibold text-xl"
      >
        🌶️ Kimchi
      </Link>
      
      <div className="flex-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent mb-1"
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto pt-4 border-t">
        <UserMenu />
      </div>
    </div>
  )
}

