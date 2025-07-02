// Client-side function to set the secret login cookie
export function setSecretLoginCookie(secretValue: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `SECRET_LOGIN=${secretValue}; path=/; SameSite=Lax`
  }
}

// Client-side function to remove the secret login cookie
export function removeSecretLoginCookie() {
  if (typeof window !== 'undefined') {
    document.cookie = 'SECRET_LOGIN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax'
  }
}

// Client-side function to get cookie value
export function getSecretLoginCookie(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  const cookies = document.cookie.split(';')
  const secretCookie = cookies.find(cookie => 
    cookie.trim().startsWith('SECRET_LOGIN=')
  )
  
  return secretCookie ? secretCookie.split('=')[1] : null
}