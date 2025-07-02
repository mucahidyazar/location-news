'use client'

import {useState} from 'react'
import {LogIn, Mail, Key} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useAuth} from '@/contexts/auth-context'
import {setSecretLoginCookie} from '@/lib/secret-auth'
import {SidebarHeader} from '@/components/ui/sidebar-header'

interface LoginSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginSidebar({isOpen, onClose}: LoginSidebarProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showSecretInput, setShowSecretInput] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {signInWithEmail, signUpWithEmail, signInWithGoogle} = useAuth()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }

      onClose()
    } catch (error: unknown) {
      console.error('Auth error:', error)

      // Display user-friendly error messages
      const errorMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Bir hata oluştu. Lütfen tekrar deneyin.'
      
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Email veya şifre hatalı. Lütfen tekrar deneyin.')
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Email adresinizi doğrulamanız gerekiyor.')
      } else if (errorMessage.includes('User already registered')) {
        setError('Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.')
      } else if (errorMessage.includes('Password should be at least 6 characters')) {
        setError('Şifre en az 6 karakter olmalıdır.')
      } else if (errorMessage.includes('Unable to validate email address')) {
        setError('Geçersiz email adresi.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (error: unknown) {
      console.error('Google auth error:', error)
      setError(
        'Google ile giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSecretLoginCookie(secretCode)
    setSecretCode('')
    setShowSecretInput(false)
    window.location.reload() // Refresh to update server-side check
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="h-full flex flex-col [background-color:var(--color-theme-surface-primary)]">
      <div className="h-full flex flex-col">
        {/* Header */}
        <SidebarHeader
          icon={<LogIn className="h-5 w-5" />}
          title={isSignUp ? 'Create Account' : 'Admin Login'}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Dev Notice */}
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Development Mode</p>
              <p>This login panel is only visible in development.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                <p className="font-medium">Hata</p>
                <p>{error}</p>
              </div>
            )}

            {/* Secret Code Input (if not authenticated yet) */}
            {!showSecretInput ? (
              <Button
                onClick={() => setShowSecretInput(true)}
                variant="outline"
                className="w-full"
              >
                <Key className="mr-2 h-4 w-4" />
                Enter Secret Code
              </Button>
            ) : (
              <form onSubmit={handleSecretSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter secret code"
                    value={secretCode}
                    onChange={e => setSecretCode(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Set Secret
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSecretInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Google Auth */}
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Auth Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                    if (error) setError(null) // Clear error when user types
                  }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (error) setError(null) // Clear error when user types
                  }}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Mail className="mr-2 h-4 w-4" />
                {isLoading
                  ? 'Please wait...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
