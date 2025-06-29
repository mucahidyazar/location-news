'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import {ColorPalette, getTheme, applyThemeVariables, defaultTheme} from '@/lib/themes'

interface ThemeContextType {
  currentTheme: string
  palette: ColorPalette
  setTheme: (themeName: string) => void
  availableThemes: string[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function ThemeProvider({children, defaultTheme: initialTheme = defaultTheme}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(initialTheme)
  const [palette, setPalette] = useState<ColorPalette>(() => getTheme(initialTheme))

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      setPalette(getTheme(savedTheme))
    }
  }, [])

  useEffect(() => {
    applyThemeVariables(palette)
  }, [palette])

  const setTheme = (themeName: string) => {
    const newPalette = getTheme(themeName)
    setCurrentTheme(themeName)
    setPalette(newPalette)
    localStorage.setItem('theme', themeName)
  }

  const availableThemes = ['aurora', 'midnight', 'sunset']

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        palette,
        setTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}