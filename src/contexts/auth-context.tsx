'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import {User} from '@supabase/supabase-js'
import {supabase} from '@/lib/supabase'
import {UserProfile} from '@/lib/types/user'
import {getUserProfile} from '@/lib/api/user-profile'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  const loadUserProfile = async (userEmail: string) => {
    try {
      setProfileLoading(true)
      const profile = await getUserProfile(userEmail)
      setUserProfile(profile)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user?.email) {
      await loadUserProfile(user.email)
    }
  }

  useEffect(() => {
    setMounted(true)
    let initialLoadCompleted = false
    
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthProvider: Getting initial session')
      try {
        // Add a small delay to ensure proper hydration
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const {
          data: {session},
        } = await supabase.auth.getSession()
        
        console.log('AuthProvider: Initial session', session?.user?.email || 'No user')
        setUser(session?.user ?? null)

        if (session?.user) {
          await checkAdminStatus(session.user.id)
          if (session.user.email) {
            await loadUserProfile(session.user.email)
          }
        } else {
          setUserProfile(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
        setUserProfile(null)
        setIsAdmin(false)
      } finally {
        console.log('AuthProvider: Initial session loading complete')
        initialLoadCompleted = true
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed', event, session?.user?.email || 'No user')
      
      // Skip if this is the initial session load
      if (!initialLoadCompleted && event === 'INITIAL_SESSION') {
        return
      }
      
      setUser(session?.user ?? null)

      if (session?.user) {
        await checkAdminStatus(session.user.id)
        if (session.user.email) {
          await loadUserProfile(session.user.email)
        }
      } else {
        setIsAdmin(false)
        setUserProfile(null)
      }
      
      // Set loading to false for auth state changes after initial load
      if (initialLoadCompleted) {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      // Check if user is admin in database using the helper function
      const {data, error} = await supabase.rpc('get_user_role', {
        user_uuid: userId,
      })

      if (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(data === 'admin')
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

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
    user,
    userProfile,
    loading,
    profileLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    isAdmin,
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
