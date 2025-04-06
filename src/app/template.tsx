'use client'

import { NavigationLayout } from '@/shared/components'

export default function Template({ children }: { children: React.ReactNode }) {
  return <NavigationLayout>{children}</NavigationLayout>
} 