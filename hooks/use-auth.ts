"use client"

import { useState, useEffect } from "react"
import { dataService } from "@/services/data-service"
import { api } from "@/lib/api"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем есть ли токен
    if (api.isAuthenticated()) {
      // В реальном приложении здесь можно декодировать JWT
      // Пока ставим заглушку
      setUser({ id: "1", login: "user", password: "", role: "manager" })
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
