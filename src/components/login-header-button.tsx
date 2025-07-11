'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { LogIn, LogOut, Key } from 'lucide-react'
import { getSecretLoginCookie } from '@/lib/secret-auth'
import {cn} from '@/lib/utils'

interface LoginHeaderButtonProps {
  onToggleLoginSidebar?: () => void
  isLoginSidebarOpen?: boolean
}

export function LoginHeaderButton({ onToggleLoginSidebar, isLoginSidebarOpen = false }: LoginHeaderButtonProps) {
  const [hasSecretAccess, setHasSecretAccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { userProfile, signOut, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
    
    // Only show in development
    const isDev = process.env.NODE_ENV === 'development'
    if (!isDev) {
      return
    }

    // Check secret login status
    const envSecret = process.env.NEXT_PUBLIC_SECRET_LOGIN_CHECK
    const cookieSecret = getSecretLoginCookie()
    
    setHasSecretAccess(!!envSecret && envSecret === cookieSecret)
  }, [])

  if (!mounted || loading) {
    return null
  }

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return null
  }

  // If no secret access, show secret login button  
  if (!hasSecretAccess) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onToggleLoginSidebar?.()
        }}
        className={cn(
          "flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]",
          isLoginSidebarOpen 
            ? "[color:var(--color-theme-primary-600)] [background-color:var(--color-theme-primary-50)]"
            : "[color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
        )}
        title="Secret Login"
      >
        <Key className={`w-5 h-5 mb-1 transition-transform duration-300 ${
          isLoginSidebarOpen ? 'scale-110 rotate-12' : ''
        }`} />
        <span>Secret</span>
      </a>
    )
  }

  // If has secret access, show login/logout button
  return (
    <>
      {userProfile ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
          className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] [color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
          title={`Logout ${userProfile.email}`}
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span>Logout</span>
        </a>
      ) : (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onToggleLoginSidebar?.()
          }}
          className={cn(
            "flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]",
            isLoginSidebarOpen 
              ? "[color:var(--color-theme-primary-600)] [background-color:var(--color-theme-primary-50)]"
              : "[color:var(--color-theme-text-secondary)] hover:[background-color:var(--color-theme-primary-50)] hover:[color:var(--color-theme-primary-500)]"
          )}
          title="Admin Login"
        >
          <LogIn className={`w-5 h-5 mb-1 transition-transform duration-300 ${
            isLoginSidebarOpen ? 'scale-110 rotate-12' : ''
          }`} />
          <span>Login</span>
        </a>
      )}
      {isLoginSidebarOpen && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg [background-color:var(--color-theme-primary-100)]"></div>
      )}
    </>
  )
}