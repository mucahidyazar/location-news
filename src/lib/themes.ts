export interface ColorPalette {
  name: string
  displayName: string
  description: string
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  secondary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  background: {
    primary: string
    secondary: string
    tertiary: string
    overlay: string
  }
  surface: {
    primary: string
    secondary: string
    tertiary: string
    elevated: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
  }
  border: {
    primary: string
    secondary: string
    focus: string
    error: string
    success: string
  }
  state: {
    error: string
    warning: string
    success: string
    info: string
  }
}

export const colorPalettes: Record<string, ColorPalette> = {
  aurora: {
    name: 'aurora',
    displayName: 'Aurora',
    description: 'Inspired by the Northern Lights - ethereal blues and greens',
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      overlay: 'rgba(15, 23, 42, 0.1)'
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#e2e8f0',
      elevated: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      inverse: '#ffffff'
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      focus: '#0ea5e9',
      error: '#ef4444',
      success: '#10b981'
    },
    state: {
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#0ea5e9'
    }
  },

  midnight: {
    name: 'midnight',
    displayName: 'Midnight',
    description: 'Deep cosmic blues with silver accents - mysterious and elegant',
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    secondary: {
      50: '#0f1419',
      100: '#1e2328',
      200: '#2d3339',
      300: '#3c434a',
      400: '#4b535b',
      500: '#5a636c',
      600: '#69737d',
      700: '#78838e',
      800: '#87939f',
      900: '#96a3b0',
      950: '#a5b3c1'
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      overlay: 'rgba(255, 255, 255, 0.1)'
    },
    surface: {
      primary: '#1e293b',
      secondary: '#334155',
      tertiary: '#475569',
      elevated: '#2563eb'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      inverse: '#0f172a'
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      focus: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e'
    },
    state: {
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#22c55e',
      info: '#3b82f6'
    }
  },

  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm oranges and purples reminiscent of golden hour',
    primary: {
      50: '#fef7ee',
      100: '#fdedd3',
      200: '#fbd7a5',
      300: '#f8b96d',
      400: '#f59332',
      500: '#f2750a',
      600: '#e35d05',
      700: '#bc4508',
      800: '#95370e',
      900: '#792f0f',
      950: '#411505'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    background: {
      primary: '#fffbf5',
      secondary: '#fef7ee',
      tertiary: '#fdedd3',
      overlay: 'rgba(120, 58, 237, 0.1)'
    },
    surface: {
      primary: '#ffffff',
      secondary: '#fef7ee',
      tertiary: '#fdedd3',
      elevated: '#ffffff'
    },
    text: {
      primary: '#451a03',
      secondary: '#7c2d12',
      tertiary: '#ea580c',
      inverse: '#ffffff'
    },
    border: {
      primary: '#fed7aa',
      secondary: '#fdba74',
      focus: '#f2750a',
      error: '#dc2626',
      success: '#16a34a'
    },
    state: {
      error: '#dc2626',
      warning: '#d97706',
      success: '#16a34a',
      info: '#0284c7'
    }
  }
}

export const defaultTheme = 'aurora'

export function getTheme(themeName: string): ColorPalette {
  return colorPalettes[themeName] || colorPalettes[defaultTheme]
}

export function getThemeNames(): string[] {
  return Object.keys(colorPalettes)
}

export function applyThemeVariables(theme: ColorPalette) {
  const root = document.documentElement
  
  // Primary colors
  root.style.setProperty('--color-theme-primary-50', theme.primary[50])
  root.style.setProperty('--color-theme-primary-100', theme.primary[100])
  root.style.setProperty('--color-theme-primary-200', theme.primary[200])
  root.style.setProperty('--color-theme-primary-300', theme.primary[300])
  root.style.setProperty('--color-theme-primary-400', theme.primary[400])
  root.style.setProperty('--color-theme-primary-500', theme.primary[500])
  root.style.setProperty('--color-theme-primary-600', theme.primary[600])
  root.style.setProperty('--color-theme-primary-700', theme.primary[700])
  root.style.setProperty('--color-theme-primary-800', theme.primary[800])
  root.style.setProperty('--color-theme-primary-900', theme.primary[900])
  root.style.setProperty('--color-theme-primary-950', theme.primary[950])
  
  // Secondary colors
  root.style.setProperty('--color-theme-secondary-50', theme.secondary[50])
  root.style.setProperty('--color-theme-secondary-100', theme.secondary[100])
  root.style.setProperty('--color-theme-secondary-200', theme.secondary[200])
  root.style.setProperty('--color-theme-secondary-300', theme.secondary[300])
  root.style.setProperty('--color-theme-secondary-400', theme.secondary[400])
  root.style.setProperty('--color-theme-secondary-500', theme.secondary[500])
  root.style.setProperty('--color-theme-secondary-600', theme.secondary[600])
  root.style.setProperty('--color-theme-secondary-700', theme.secondary[700])
  root.style.setProperty('--color-theme-secondary-800', theme.secondary[800])
  root.style.setProperty('--color-theme-secondary-900', theme.secondary[900])
  root.style.setProperty('--color-theme-secondary-950', theme.secondary[950])
  
  // Background colors
  root.style.setProperty('--color-theme-bg-primary', theme.background.primary)
  root.style.setProperty('--color-theme-bg-secondary', theme.background.secondary)
  root.style.setProperty('--color-theme-bg-tertiary', theme.background.tertiary)
  root.style.setProperty('--color-theme-bg-overlay', theme.background.overlay)
  
  // Surface colors
  root.style.setProperty('--color-theme-surface-primary', theme.surface.primary)
  root.style.setProperty('--color-theme-surface-secondary', theme.surface.secondary)
  root.style.setProperty('--color-theme-surface-tertiary', theme.surface.tertiary)
  root.style.setProperty('--color-theme-surface-elevated', theme.surface.elevated)
  
  // Text colors
  root.style.setProperty('--color-theme-text-primary', theme.text.primary)
  root.style.setProperty('--color-theme-text-secondary', theme.text.secondary)
  root.style.setProperty('--color-theme-text-tertiary', theme.text.tertiary)
  root.style.setProperty('--color-theme-text-inverse', theme.text.inverse)
  
  // Border colors
  root.style.setProperty('--color-theme-border-primary', theme.border.primary)
  root.style.setProperty('--color-theme-border-secondary', theme.border.secondary)
  root.style.setProperty('--color-theme-border-focus', theme.border.focus)
  root.style.setProperty('--color-theme-border-error', theme.border.error)
  root.style.setProperty('--color-theme-border-success', theme.border.success)
  
  // State colors
  root.style.setProperty('--color-theme-state-error', theme.state.error)
  root.style.setProperty('--color-theme-state-warning', theme.state.warning)
  root.style.setProperty('--color-theme-state-success', theme.state.success)
  root.style.setProperty('--color-theme-state-info', theme.state.info)
}