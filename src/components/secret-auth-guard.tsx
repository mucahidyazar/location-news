'use client'

import dynamic from 'next/dynamic'

interface SecretAuthGuardProps {
  children?: React.ReactNode
}

// Dynamically import AuthWrapper to avoid SSR issues
const DynamicAuthWrapper = dynamic(
  () => import('./auth-wrapper').then(mod => mod.AuthWrapper),
  { 
    ssr: false,
    loading: () => null
  }
)

export function SecretAuthGuard({ children }: SecretAuthGuardProps) {
  return (
    <>
      {children}
      <DynamicAuthWrapper />
    </>
  )
}