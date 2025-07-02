'use client'

import {useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import {cn} from '@/lib/utils'

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen [background:linear-gradient(135deg,#f8fafc_0%,#dbeafe_50%,#e0e7ff_100%)]">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Image
                    src="/logo.svg"
                    alt="mappy.news"
                    width={80}
                    height={80}
                    className="opacity-80"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center [background:linear-gradient(45deg,#ef4444,#dc2626)]">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                We&apos;re sorry for the inconvenience. An unexpected error has
                occurred while processing your request.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <button
                onClick={reset}
                className="w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl [background:linear-gradient(45deg,#2563eb,#4f46e5)] hover:[background:linear-gradient(45deg,#1d4ed8,#4338ca)]"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Try again</span>
                </div>
              </button>

              <Link
                href="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Go back home</span>
                </div>
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              <p>Error ID: {error.digest || 'Unknown'}</p>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <details className="text-left">
                <summary className="cursor-pointer font-semibold text-red-800 mb-3 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span>Error Details (Development Mode)</span>
                </summary>
                <div className="mt-3 bg-red-900 text-red-100 p-3 rounded-lg">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {error.message}
                    {error.stack && (
                      <>
                        {'\n\nStack Trace:\n'}
                        {error.stack}
                      </>
                    )}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
