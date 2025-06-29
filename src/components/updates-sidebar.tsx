'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, GitCommit, User, ExternalLink, X } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface GitCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
  }
  date: string
  url: string
}

interface UpdatesSidebarProps {
  onClose: () => void
}

export default function UpdatesSidebar({ onClose }: UpdatesSidebarProps) {
  const { palette } = useTheme()
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCommits()
  }, [])

  const fetchCommits = async () => {
    try {
      setLoading(true)
      // GitHub API endpoint for commits
      // Bu örnek için mock data kullanıyorum, gerçek GitHub repo bilgileri ile değiştirilebilir
      const response = await fetch('/api/git/commits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch commits')
      }

      const data = await response.json()
      setCommits(data.slice(0, 20)) // Son 20 commit
    } catch (err) {
      console.error('Error fetching commits:', err)
      setError('Failed to load updates')
      // Fallback mock data for demo
      setCommits([
        {
          sha: 'abc123',
          message: 'Add smooth sidebar animations and improve UX',
          author: { name: 'Developer', email: 'dev@example.com' },
          date: '2024-01-15T10:30:00Z',
          url: 'https://github.com/user/repo/commit/abc123'
        },
        {
          sha: 'def456',
          message: 'Fix datepicker width and map resize issues',
          author: { name: 'Developer', email: 'dev@example.com' },
          date: '2024-01-14T15:45:00Z',
          url: 'https://github.com/user/repo/commit/def456'
        },
        {
          sha: 'ghi789',
          message: 'Implement interactive map with news markers',
          author: { name: 'Developer', email: 'dev@example.com' },
          date: '2024-01-13T09:15:00Z',
          url: 'https://github.com/user/repo/commit/ghi789'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  const getCommitTypeIcon = (message: string) => {
    const msg = message.toLowerCase()
    if (msg.includes('fix') || msg.includes('bug')) {
      return '🐛'
    } else if (msg.includes('add') || msg.includes('new')) {
      return '✨'
    } else if (msg.includes('update') || msg.includes('improve')) {
      return '⚡'
    } else if (msg.includes('refactor')) {
      return '♻️'
    } else if (msg.includes('style') || msg.includes('ui')) {
      return '💄'
    } else if (msg.includes('docs')) {
      return '📝'
    } else {
      return '🔧'
    }
  }

  return (
    <div className="h-full flex flex-col" style={{backgroundColor: palette.surface.primary}}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{
        background: 'linear-gradient(135deg, var(--color-theme-secondary-100) 0%, var(--color-theme-secondary-200) 50%, var(--color-theme-primary-100) 100%)',
        borderColor: palette.border.primary
      }}>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{color: palette.text.primary}}>
          <GitCommit className="w-5 h-5" style={{color: palette.secondary[600]}} />
          🚀 Updates & Changes
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full transition-colors"
          style={{color: palette.text.secondary}}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = palette.surface.secondary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: palette.secondary[600]}}></div>
            <span className="ml-3" style={{color: palette.text.secondary}}>Loading updates...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center" style={{color: palette.state.error}}>
            <p>{error}</p>
            <button
              onClick={fetchCommits}
              className="mt-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: palette.state.error + '20',
                color: palette.state.error
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = palette.state.error + '30'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = palette.state.error + '20'
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {commits.map((commit, index) => (
              <div
                key={commit.sha}
                className="group relative p-4 rounded-lg border transition-all duration-200"
                style={{
                  borderColor: palette.border.secondary,
                  backgroundColor: palette.surface.primary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.border.focus
                  e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.backgroundColor = palette.surface.secondary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = palette.border.secondary
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.backgroundColor = palette.surface.primary
                }}
              >
                {/* Commit Type Icon */}
                <div className="absolute -left-2 top-4 w-8 h-8 border-2 rounded-full flex items-center justify-center text-sm" style={{
                  backgroundColor: palette.surface.primary,
                  borderColor: palette.secondary[200]
                }}>
                  {getCommitTypeIcon(commit.message)}
                </div>

                {/* Commit Info */}
                <div className="ml-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium line-clamp-2 leading-tight transition-colors" style={{
                      color: palette.text.primary
                    }}>
                      {commit.message}
                    </h3>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-1 opacity-0 group-hover:opacity-100 rounded transition-all"
                      style={{
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = palette.secondary[100]
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      title="View on GitHub"
                    >
                      <ExternalLink className="w-3 h-3" style={{color: palette.secondary[600]}} />
                    </a>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-xs" style={{color: palette.text.tertiary}}>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{commit.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(commit.date)}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs font-mono" style={{color: palette.text.tertiary}}>
                    {commit.sha.substring(0, 7)}
                  </div>
                </div>

                {/* Timeline line */}
                {index < commits.length - 1 && (
                  <div className="absolute left-2 top-12 w-px h-6" style={{
                    background: `linear-gradient(to bottom, ${palette.secondary[200]}, transparent)`
                  }}></div>
                )}
              </div>
            ))}

            {/* Footer */}
            <div className="text-center py-4 border-t border-gray-200 mt-6">
              <p className="text-xs text-gray-500">
                Showing latest {commits.length} updates
              </p>
              <a
                href="https://github.com/yourusername/yourrepo/commits"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
              >
                <GitCommit className="w-3 h-3" />
                View all commits on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}