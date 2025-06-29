'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface MainLayoutContextType {
  useCustomIcons: boolean
  setUseCustomIcons: (value: boolean) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (value: boolean) => void
  isSettingsSidebarOpen: boolean
  setIsSettingsSidebarOpen: (value: boolean) => void
  isUpdatesSidebarOpen: boolean
  setIsUpdatesSidebarOpen: (value: boolean) => void
  isMenuSidebarOpen: boolean
  setIsMenuSidebarOpen: (value: boolean) => void
}

const MainLayoutContext = createContext<MainLayoutContextType | undefined>(undefined)

export const useMainLayout = () => {
  const context = useContext(MainLayoutContext)
  if (!context) {
    throw new Error('useMainLayout must be used within a MainLayoutProvider')
  }
  return context
}

export function MainLayoutProvider({ children }: { children: ReactNode }) {
  const [useCustomIcons, setUseCustomIcons] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false)
  const [isUpdatesSidebarOpen, setIsUpdatesSidebarOpen] = useState(false)
  const [isMenuSidebarOpen, setIsMenuSidebarOpen] = useState(false)

  return (
    <MainLayoutContext.Provider value={{
      useCustomIcons,
      setUseCustomIcons,
      isSidebarOpen, 
      setIsSidebarOpen,
      isSettingsSidebarOpen,
      setIsSettingsSidebarOpen,
      isUpdatesSidebarOpen,
      setIsUpdatesSidebarOpen,
      isMenuSidebarOpen,
      setIsMenuSidebarOpen
    }}>
      {children}
    </MainLayoutContext.Provider>
  )
}