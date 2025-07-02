'use client'

import { useState, useEffect } from 'react'
import { LoginSidebar } from './login-sidebar'
import { useAuth } from '@/contexts/auth-context'
import { LogIn, LogOut, Key } from 'lucide-react'
import { getSecretLoginCookie } from '@/lib/secret-auth'

interface AuthWrapperProps {
  children?: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps = {}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [hasSecretAccess, setHasSecretAccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setMounted(true)
      
      // Only show in development
      const isDev = process.env.NODE_ENV === 'development'
      if (!isDev) {
        return
      }

      // Check secret login status
      const envSecret = process.env.NEXT_PUBLIC_SECRET_LOGIN_CHECK
      const cookieSecret = getSecretLoginCookie()
      
      console.log('AuthWrapper Debug:', { 
        envSecret, 
        cookieSecret, 
        hasAccess: !!envSecret && envSecret === cookieSecret 
      })
      
      setHasSecretAccess(!!envSecret && envSecret === cookieSecret)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || loading) {
    return null
  }

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return children ? <>{children}</> : null
  }

  // If children are provided, check auth and render children if authenticated
  if (children) {
    // If has secret access and user is logged in, show children
    if (hasSecretAccess && user) {
      return <>{children}</>
    }
    // Otherwise don't show children
    return null
  }

  // If no secret access, show secret login button  
  if (!hasSecretAccess) {
    return (
      <>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setIsLoginOpen(true)
          }}
          className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] [color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
          title="Secret Login"
        >
          <Key className="w-5 h-5 mb-1" />
          <span>Secret</span>
        </a>
        
        <LoginSidebar
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </>
    )
  }

  // If has secret access, show login button
  return (
    <>
      {user ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
          className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] [color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
          title={`Logout ${user.email}`}
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span>Logout</span>
        </a>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setIsLoginOpen(true)
          }}
          className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] [color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
          title="Admin Login"
        >
          <LogIn className="w-5 h-5 mb-1" />
          <span>Login</span>
        </a>
      )}

      <LoginSidebar
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  )
}