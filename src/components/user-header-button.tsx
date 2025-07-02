'use client'

import {useState, useEffect} from 'react'
import {useAuth} from '@/contexts/auth-context'
import {LogIn, Key} from 'lucide-react'
import {getSecretLoginCookie} from '@/lib/secret-auth'
import {UserAvatar} from '@/components/user-avatar'
import {cn} from '@/lib/utils'

interface UserHeaderButtonProps {
  onToggleLoginSidebar?: () => void
  onToggleUserSidebar?: () => void
  isLoginSidebarOpen?: boolean
  isUserSidebarOpen?: boolean
}

export function UserHeaderButton({
  onToggleLoginSidebar,
  onToggleUserSidebar,
  isLoginSidebarOpen = false,
  isUserSidebarOpen = false,
}: UserHeaderButtonProps) {
  const {user, userProfile, loading, refreshProfile} = useAuth()
  const [hasSecretAccess, setHasSecretAccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize secret access check on client side only
  useEffect(() => {
    const envSecret = process.env.NEXT_PUBLIC_SECRET_LOGIN_CHECK
    const cookieSecret = getSecretLoginCookie()
    setHasSecretAccess(!!envSecret && envSecret === cookieSecret)
    setMounted(true)
  }, [])

  // Auto-refresh profile if user is logged in but profile is missing
  useEffect(() => {
    if (user?.email && !userProfile && !loading && mounted) {
      refreshProfile()
    }
  }, [user?.email, userProfile, loading, refreshProfile, mounted])

  // Only show in development
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) {
    return null
  }

  // Show loading placeholder during auth loading or before mounted
  console.log('x1 loading', loading)
  console.log('x1 mounted', mounted)
  if (loading || !mounted) {
    return (
      <div className="flex flex-col items-center py-2 px-0 md:p-3 text-xs rounded-lg min-w-[56px] md:min-w-[80px]">
        <div className="w-5 h-5 mb-1 bg-gray-300 rounded animate-pulse" />
        <span className="text-gray-400">...</span>
      </div>
    )
  }

  // If user is logged in, show user button regardless of secret access
  // If no user and no secret access, show secret login button
  const ACTIVE_SECRET = false
  if (!user && !hasSecretAccess) {
    if (!ACTIVE_SECRET) return null

    return (
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          onToggleLoginSidebar?.()
        }}
        className={cn(
          'flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]',
          'hover:[color:var(--color-theme-primary-500)] hover:[background-color:var(--color-theme-primary-50)]',
          isLoginSidebarOpen
            ? [
                '[color:var(--color-theme-primary-600)]',
                '[background-color:var(--color-theme-primary-50)]',
              ]
            : ['[color:var(--color-theme-text-secondary)]'],
        )}
        title="Secret Login"
      >
        <Key
          className={`w-5 h-5 mb-1 transition-transform duration-300 ${
            isLoginSidebarOpen ? 'scale-110 rotate-12' : ''
          }`}
        />
        <span>Secret</span>
      </a>
    )
  }

  // Show user avatar or login button
  return (
    <>
      {user ? (
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            onToggleUserSidebar?.()
          }}
          className={cn(
            'flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]',
            'hover:[color:var(--color-theme-primary-500)] hover:[background-color:var(--color-theme-primary-50)]',
            isUserSidebarOpen
              ? [
                  '[color:var(--color-theme-primary-600)]',
                  '[background-color:var(--color-theme-primary-50)]',
                ]
              : ['[color:var(--color-theme-text-secondary)]'],
          )}
          title={`User: ${userProfile?.full_name || user.email}`}
        >
          <div className="mb-1">
            <UserAvatar userProfile={userProfile} size="sm" />
          </div>
          <span>User</span>
        </a>
      ) : (
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            onToggleLoginSidebar?.()
          }}
          className={cn(
            'flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]',
            'hover:[color:var(--color-theme-primary-500)] hover:[background-color:var(--color-theme-primary-50)]',
            isLoginSidebarOpen
              ? [
                  '[color:var(--color-theme-primary-600)]',
                  '[background-color:var(--color-theme-primary-50)]',
                ]
              : ['[color:var(--color-theme-text-secondary)]'],
          )}
          title="Admin Login"
        >
          <LogIn
            className={`w-5 h-5 mb-1 transition-transform duration-300 ${
              isLoginSidebarOpen ? 'scale-110 rotate-12' : ''
            }`}
          />
          <span>Login</span>
        </a>
      )}
      {(isLoginSidebarOpen || isUserSidebarOpen) && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg [background-color:var(--color-theme-primary-100)]"></div>
      )}
    </>
  )
}
