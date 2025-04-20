'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/feed')
        return
      }
      setIsLoading(false)
    }
    checkUser()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">join kimchi</h1>
            <div className="flex -space-x-2 mb-8">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#D9361E] to-[#FF8C77] flex items-center justify-center text-white text-xl font-medium shadow-sm"
                >
                  🥬
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Kimchi is a cozy community for makers.</h2>
              <p className="text-gray-700 mb-6">
                We celebrate wins, provide support during challenges, and maintain gentle accountability 
                while creating meaningful progress on our projects.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#D9361E] hover:bg-[#B22D19] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D9361E] shadow-sm"
              >
                join kimchi
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-[#D9361E] mb-4">Curious minds, building tomorrow—together.</h3>
              <p className="text-gray-600 mb-8">
                Hackers, devs, and researchers converge to invent a more human-centric AI age.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Habit-stack for output</h4>
                    <p className="text-gray-600">Build with driven makers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Braintrust on tap</h4>
                    <p className="text-gray-600">Co-create with others in the Zuzalu realm.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Accountability that sticks</h4>
                    <p className="text-gray-600">Log wins, course-correct together.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
