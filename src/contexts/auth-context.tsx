'use client'

import {createContext, useContext, useEffect, useRef, useState} from 'react'
import {Session, User} from '@supabase/supabase-js'
import {supabase} from '@/lib/supabase'
import {UserProfile} from '@/lib/types/user'
import {getUserProfile} from '@/lib/api/user-profile'

interface AuthContextType {
  userProfile: UserProfile | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const loadUserProfile = async (userEmail: string, localSession?: Session) => {
    try {
      setLoading(true)
      const sessionToken = localSession?.access_token || session?.access_token
      if (!sessionToken) return

      const responseUserProfile = await fetch(
        `/api/user-profile?email=${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
      )
      const userProfile = await responseUserProfile.json()
      console.log('AuthProvider: User profile loaded', userProfile)
      setUserProfile(userProfile.profile as UserProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    const sessionUserEmail = session?.user?.email
    if (sessionUserEmail) {
      await loadUserProfile(sessionUserEmail, session)
    }
  }

  useEffect(() => {
    if (!isMounted.current) return

    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthProvider: Getting initial session')
      try {
        const {
          data: {session},
        } = await supabase.auth.getSession()

        console.log('AuthProvider: Initial session', session)
        if (!session) return null

        setSession(session)
        await loadUserProfile(session.user?.email as string, session)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setSession(null)
        setUserProfile(null)
      } finally {
        console.log('AuthProvider: Initial session loading complete')
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        'AuthProvider: Auth state changed',
        event,
        session?.user?.email || 'No user',
      )

      // Skip the initial session event since we handle it above
      if (event === 'INITIAL_SESSION') {
        return
      }

      setSession(session ?? null)

      if (session?.user?.email) {
        await loadUserProfile(session.user.email, session)
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const {error} = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : `${
            process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          }/auth/callback`

    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const {error} = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    userProfile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    isAdmin: userProfile?.role === 'admin',
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
