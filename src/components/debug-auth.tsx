'use client'

import { useEffect, useState } from 'react'
import { getSecretLoginCookie } from '@/lib/secret-auth'

export function DebugAuth() {
  const [info, setInfo] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      isDev: process.env.NODE_ENV === 'development',
      envSecret: process.env.NEXT_PUBLIC_SECRET_LOGIN_CHECK,
      cookieSecret: getSecretLoginCookie(),
      hasWindow: typeof window !== 'undefined'
    }
    setInfo(debugInfo)
    console.log('Auth Debug Info:', debugInfo)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs z-50 max-w-sm">
      <div>NODE_ENV: {String(info.nodeEnv)}</div>
      <div>isDev: {String(info.isDev)}</div>
      <div>envSecret: {info.envSecret ? 'SET' : 'NOT SET'}</div>
      <div>cookieSecret: {info.cookieSecret ? 'SET' : 'NOT SET'}</div>
      <div>hasWindow: {String(info.hasWindow)}</div>
      <div>Match: {String(info.envSecret === info.cookieSecret)}</div>
    </div>
  )
}