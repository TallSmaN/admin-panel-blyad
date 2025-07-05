"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/services/data-service"
import { api } from "@/lib/api"
import { JWTManager } from "@/lib/jwt-utils"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем есть ли токен
    if (api.isAuthenticated()) {
      const claims = JWTManager.getUserFromToken()
      if (claims) {
        setUser({
          id: claims.user_id || "",
          login: claims.login,
          password: "",
          role: claims.isManager !== undefined
            ? claims.isManager
              ? "manager"
              : "courier"
            : claims.role,
          cities: claims.cities,
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await dataService.login(username, password)
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
      await dataService.logout()
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
