// 🚀 ПРОСТОЙ API КЛИЕНТ
// Фронтендеру НЕ НУЖНО это менять!

import { BACKEND_CONFIG } from "@/config/backend"

// Типы ответов
export interface ApiSuccess<T = any> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: number
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

class SimpleAPI {
  private getToken(): string | null {
    if (typeof document === "undefined") return null

    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((c) => c.trim().startsWith(`${BACKEND_CONFIG.SETTINGS.TOKEN_COOKIE_NAME}=`))

    return tokenCookie ? tokenCookie.split("=")[1] : null
  }

  private setToken(token: string): void {
    if (typeof document === "undefined") return

    const expires = new Date()
    expires.setHours(expires.getHours() + BACKEND_CONFIG.SETTINGS.TOKEN_EXPIRES_HOURS)

    document.cookie = `${BACKEND_CONFIG.SETTINGS.TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
  }

  private removeToken(): void {
    if (typeof document === "undefined") return

    document.cookie = `${BACKEND_CONFIG.SETTINGS.TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const token = this.getToken()
      const url = `${BACKEND_CONFIG.API_URL}${endpoint}`

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        credentials: "include",
      })

      // Если 401 - удаляем токен и редиректим
      if (response.status === 401) {
        this.removeToken()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        return { success: false, error: "Не авторизован", code: 401 }
      }

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Ошибка ${response.status}`,
          code: response.status,
        }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: "Ошибка сети" }
    }
  }

  // 🔐 Авторизация
  async login(login: string, password: string): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>(BACKEND_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ login, password }),
    })

    if (response.success) {
      this.setToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(BACKEND_CONFIG.ENDPOINTS.LOGOUT, {
      method: "POST",
    })

    this.removeToken()
    return response
  }

  // 📊 CRUD операции
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // 📁 Загрузка файлов
  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${BACKEND_CONFIG.API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `Ошибка ${response.status}`,
        }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: "Ошибка загрузки файла" }
    }
  }

  // 🔍 Проверка авторизации
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const api = new SimpleAPI()
