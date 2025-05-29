// Упрощаем AuthProvider, убирая дублирующую логику редиректов
// и оставляя только управление состоянием аутентификации

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { isLoggedIn, getUserProfile, logout } from "@/lib/auth"

// Define the type for the auth context
type AuthContextType = {
  isAuthenticated: boolean
  userProfile: any | null
  loading: boolean
  error: string | null
  logout: () => void
  refreshUserProfile: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (isLoggedIn()) {
      try {
        setError(null)
        setLoading(true)
        console.log("Refreshing user profile...")
        const profile = await getUserProfile()
        if (profile) {
          setUserProfile(profile)
          setIsAuthenticated(true)
        } else {
          setError("Не удалось получить данные профиля")
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError(error instanceof Error ? error.message : "Ошибка при получении данных профиля")
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    } else {
      setIsAuthenticated(false)
      setUserProfile(null)
      setLoading(false)
    }
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isLoggedIn()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          await refreshUserProfile()
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError(err instanceof Error ? err.message : "Ошибка проверки аутентификации")
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Provide the auth context
  const value = {
    isAuthenticated,
    userProfile,
    loading,
    error,
    logout,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
