"use client"

import { useState, useEffect } from "react"
import { authService } from "@/services/auth-service"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем JWT при загрузке
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await authService.login(username, password)
      if (loggedInUser) {
        setUser(loggedInUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Ошибка входа:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Ошибка выхода:", error)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }
}
