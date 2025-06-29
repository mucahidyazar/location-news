'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #faf5ff 50%, #fdf2f8 100%)',
      }}
    >
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
                  <div
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                    }}
                  >
                    <span className="text-white text-lg font-bold">?</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-8xl font-bold mb-4">
                  <span
                    style={{
                      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    404
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Page not found
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Sorry, we couldn&apos;t find the page you&apos;re looking for.
                  The page might have been moved, deleted, or the URL might be
                  incorrect.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <Link
                href="/"
                className="block w-full text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(45deg, #7c3aed, #d946ef)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(45deg, #6d28d9, #c026d3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    'linear-gradient(45deg, #7c3aed, #d946ef)'
                }}
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

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>Go back</span>
                </div>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Need help?</span>
                </div>
                <a
                  href="mailto:support@example.com"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <Link
                href="/"
                className="hover:text-purple-600 transition-colors"
              >
                Home
              </Link>
              <span>•</span>
              <Link
                href="/about"
                className="hover:text-purple-600 transition-colors"
              >
                About
              </Link>
              <span>•</span>
              <Link
                href="/contact"
                className="hover:text-purple-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
