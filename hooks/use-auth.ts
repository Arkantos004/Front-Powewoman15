import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  id?: number
  email: string
  full_name: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // Cargar usuario y token al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error parsing user:', error)
          logout()
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = (userData: AuthUser, authToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      setToken(authToken)
      setIsLoggedIn(true)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setUser(null)
    setToken(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  const updateUser = (userData: Partial<AuthUser>) => {
    const updatedUser = { ...user, ...userData } as AuthUser
    setUser(updatedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    login,
    logout,
    updateUser,
  }
}
