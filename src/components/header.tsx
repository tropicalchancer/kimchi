import { UserNav } from "@/components/user-nav"
import { AuthButton } from "@/components/auth-button"
import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex gap-4">
          <Link href="/" className="font-medium">Everyone</Link>
          <Link href="/following" className="text-muted-foreground">Following</Link>
          <Link href="/pro" className="text-muted-foreground">Pro</Link>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

