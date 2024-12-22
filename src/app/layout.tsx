import { Inter } from 'next/font/google'
import { Providers } from "@/components/providers"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kimchi - Ship Together",
  description: "We're a group of makers shipping together.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Header />
              <div className="container py-4">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

