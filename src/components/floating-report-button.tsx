'use client'

import { MessageSquarePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingReportButtonProps {
  onClick: () => void
  isFormOpen: boolean
  isSidebarOpen?: boolean
  className?: string
}

export function FloatingReportButton({ 
  onClick, 
  isFormOpen, 
  isSidebarOpen = false, 
  className 
}: FloatingReportButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50',
        'w-14 h-14 rounded-full shadow-lg',
        'flex items-center justify-center',
        'transition-all duration-300 ease-out',
        'hover:scale-110 hover:shadow-xl',
        'active:scale-95',
        '[background-color:var(--color-theme-primary-500)]',
        'text-white',
        'hover:[background-color:var(--color-theme-primary-600)]',
        // Smooth transition for icon change
        'transition-transform duration-200 ease-in-out',
        className
      )}
      style={{
        bottom: '24px',
        right: isSidebarOpen ? '420px' : '24px',
        transition: 'all 300ms ease-out'
      }}
      title={isFormOpen ? "Formu Kapat" : "Haber Bildir"}
      aria-label={isFormOpen ? "Haber bildirimi formunu kapat" : "Yeni haber bildirimi oluştur"}
    >
      {isFormOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageSquarePlus className="w-6 h-6" />
      )}
    </button>
  )
}