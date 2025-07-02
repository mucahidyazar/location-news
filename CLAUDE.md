# Mappy.News - Development Conventions & Guidelines

This document outlines the coding conventions, architectural decisions, and development guidelines for the Mappy.News project. All contributors and AI assistants should follow these rules to maintain consistency and code quality.

## <¨ Styling & CSS Conventions

### 1. Tailwind CSS Priority
- **ALWAYS use Tailwind CSS** classes instead of inline styles
- **NEVER use inline `style={{}}` unless absolutely necessary**
- Only acceptable `style={{}}` use cases:
  - Dynamic colors calculated at runtime (e.g., user avatars, theme previews)
  - Third-party library requirements (e.g., Leaflet map markers)
  - Mathematical calculations (e.g., dynamic widths/heights)

```tsx
// L BAD - Avoid inline styles
<div style={{ backgroundColor: 'var(--color-theme-surface-primary)' }}>

//  GOOD - Use Tailwind classes
<div className="bg-[var(--color-theme-surface-primary)]">

//  ACCEPTABLE - Dynamic runtime values
<div style={{ backgroundColor: userColor }}>
```

### 2. Mouse Event Handlers
- **NEVER use `onMouseEnter` and `onMouseLeave`** for hover effects
- **ALWAYS use Tailwind hover utilities** instead

```tsx
// L BAD - Mouse event handlers
<button 
  onMouseEnter={e => e.target.style.backgroundColor = 'blue'}
  onMouseLeave={e => e.target.style.backgroundColor = 'white'}
>

//  GOOD - Tailwind hover classes
<button className="bg-white hover:bg-blue-500">
```

### 3. Conditional Styling
- **ALWAYS use `cn()` utility** with Tailwind classes for conditional styling
- **NEVER use ternary operators** in inline styles for static values

```tsx
// L BAD - Inline conditional styles
<div style={{
  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent'
}}>

//  GOOD - cn() utility with Tailwind
<div className={cn(
  'transition-colors',
  isActive 
    ? 'bg-[var(--color-primary)]' 
    : 'bg-transparent'
)}>
```

### 4. CSS Custom Properties
- Use CSS custom properties for theme variables: `var(--color-theme-*)`
- Wrap in Tailwind arbitrary values: `bg-[var(--color-theme-primary-500)]`

## =Ý Form Handling

### 1. React Hook Form + Zod
- **ALWAYS use React Hook Form** for form state management
- **ALWAYS use Zod** for form validation schemas
- **NEVER use plain HTML form validation**

```tsx
//  REQUIRED Pattern
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  // Form implementation...
}
```

### 2. Form Error Handling
- Display validation errors from Zod schema
- Use consistent error styling across forms
- Show loading states during submission

## = API & Data Fetching

### 1. TanStack Query (React Query)
- **ALWAYS use TanStack Query** for server state management
- **NEVER use useEffect** for API calls
- **ALWAYS implement proper error and loading states**

```tsx
//  REQUIRED Pattern
import { useQuery, useMutation } from '@tanstack/react-query'

const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const useCreateNews = () => {
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })
}
```

### 2. API Service Layer
- Keep API functions in dedicated service files
- Use consistent response/error handling
- Implement proper TypeScript types for API responses

## >é Component Architecture

### 1. Component Structure
- Use functional components with hooks
- Keep components small and focused (Single Responsibility)
- Extract reusable logic into custom hooks

### 2. Props & TypeScript
- **ALWAYS define TypeScript interfaces** for component props
- Use descriptive prop names
- Provide default values where appropriate

```tsx
//  GOOD
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children,
  onClick 
}: ButtonProps) => {
  // Component implementation
}
```

### 3. State Management
- Use React hooks for local component state
- Use TanStack Query for server state
- Use Context API sparingly for truly global state
- **NEVER use Redux** unless absolutely necessary

## <¯ Naming Conventions

### 1. Files & Folders
- Use kebab-case for file names: `news-sidebar.tsx`
- Use PascalCase for component names: `NewsSidebar`
- Use camelCase for utility functions: `formatDate`

### 2. Variables & Functions
- Use descriptive names that explain intent
- Use camelCase for variables and functions
- Use UPPER_SNAKE_CASE for constants

```tsx
//  GOOD
const isUserLoggedIn = true
const handleFormSubmit = () => {}
const MAX_RETRY_ATTEMPTS = 3

// L BAD
const flag = true
const fn = () => {}
const num = 3
```

## =' Import Organization

### 1. Import Order
```tsx
// 1. React and React-related imports
import React, { useState, useEffect } from 'react'

// 2. Third-party library imports
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Internal components
import { Button } from '@/components/ui/button'
import { NewsCard } from '@/components/news-card'

// 4. Utilities and helpers
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-utils'

// 5. Types
import type { NewsItem } from '@/lib/types'
```

### 2. Absolute Imports
- **ALWAYS use absolute imports** with `@/` prefix
- **NEVER use relative imports** like `../../../`

## =à Performance Best Practices

### 1. React Optimization
- Use `useMemo` and `useCallback` for expensive computations
- Implement proper dependency arrays
- Use `React.memo` for components that receive stable props

### 2. Bundle Optimization
- Use dynamic imports for code splitting
- Lazy load components that aren't immediately needed
- Optimize images and assets

## = Code Quality

### 1. ESLint & Prettier
- Follow ESLint rules strictly
- Use Prettier for consistent formatting
- **NEVER disable ESLint rules** without good reason

### 2. TypeScript
- Use strict TypeScript configuration
- **NEVER use `any` type** - use proper typing
- Define interfaces for all data structures

```tsx
// L BAD
const data: any = fetchData()

//  GOOD
interface UserData {
  id: string
  name: string
  email: string
}
const data: UserData = fetchData()
```

## >ê Testing

### 1. Testing Strategy
- Write unit tests for utility functions
- Write integration tests for components
- Use React Testing Library for component testing

### 2. Test Organization
- Keep test files next to source files with `.test.tsx` extension
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

## < Internationalization (i18n)

### 1. Text Content
- **NEVER hardcode text** in components
- **ALWAYS use `useTranslations()`** hook from next-intl
- Keep translation keys organized and descriptive

```tsx
// L BAD
<button>Submit Form</button>

//  GOOD
const t = useTranslations()
<button>{t('form.submit')}</button>
```

## <¨ Theme & Design System

### 1. Design Tokens
- Use CSS custom properties for colors, spacing, typography
- Follow the established design system
- **NEVER use hardcoded colors** or magic numbers

### 2. Component Variants
- Use consistent variant patterns across components
- Implement size and style variants systematically

## =ñ Responsive Design

### 1. Mobile-First Approach
- Design for mobile first, then scale up
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test on multiple screen sizes

### 2. Accessibility
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation works
- Maintain color contrast ratios

## = Security

### 1. Input Validation
- Validate all user inputs with Zod schemas
- Sanitize data before displaying
- Use proper authentication and authorization

### 2. Environment Variables
- **NEVER commit secrets** to version control
- Use environment variables for configuration
- Validate environment variables at startup

## =Ê Monitoring & Analytics

### 1. Error Handling
- Implement proper error boundaries
- Log errors appropriately
- Provide user-friendly error messages

### 2. Performance Monitoring
- Monitor bundle sizes
- Track Core Web Vitals
- Implement performance budgets

## =€ Deployment & CI/CD

### 1. Build Process
- Ensure builds pass all linting and type checking
- Run tests before deployment
- Optimize for production builds

### 2. Version Control
- Use meaningful commit messages
- Follow conventional commit format
- Keep commits atomic and focused

---

##   Common Anti-Patterns to Avoid

1. **Inline styles instead of Tailwind classes**
2. **Mouse event handlers for hover effects**
3. **useEffect for API calls instead of TanStack Query**
4. **Plain forms without React Hook Form + Zod**
5. **Relative imports instead of absolute imports**
6. **Hardcoded text instead of translations**
7. **Any types instead of proper TypeScript interfaces**
8. **Direct DOM manipulation instead of React patterns**
9. **Class components instead of functional components**
10. **Prop drilling instead of proper state management**

---

## =Ú Key Libraries & Tools

- **Styling**: Tailwind CSS, cn() utility
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Routing**: Next.js App Router
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript (strict mode)

This document should be updated as the project evolves and new conventions are established. All team members should refer to this guide when making code changes.