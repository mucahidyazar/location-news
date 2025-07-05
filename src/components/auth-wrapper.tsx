'use client'

import {useState, useEffect, useRef} from 'react'
import {LoginSidebar} from './login-sidebar'
import {useAuth} from '@/contexts/auth-context'
import {LogIn, LogOut, Key} from 'lucide-react'
import {getSecretLoginCookie} from '@/lib/secret-auth'

interface AuthWrapperProps {
  children?: React.ReactNode
}

export function AuthWrapper({children}: AuthWrapperProps = {}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [hasSecretAccess, setHasSecretAccess] = useState(false)
  const {userProfile, signOut, loading} = useAuth()
  const isMounted = useRef(false)

  useEffect(() => {
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      isMounted.current = true

      // Check secret login status
      const envSecret = process.env.NEXT_PUBLIC_SECRET_LOGIN_CHECK
      const cookieSecret = getSecretLoginCookie()

      console.log('AuthWrapper Debug:', {
        envSecret,
        cookieSecret,
        hasAccess: !!envSecret && envSecret === cookieSecret,
      })

      setHasSecretAccess(!!envSecret && envSecret === cookieSecret)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted.current || loading) return null

  // If children are provided, check auth and render children if authenticated
  if (children) {
    // If has secret access and user is logged in, show children
    if (hasSecretAccess && userProfile) {
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
          onClick={e => {
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
      {userProfile ? (
        <a
          href="#"
          onClick={e => {
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
          onClick={e => {
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
