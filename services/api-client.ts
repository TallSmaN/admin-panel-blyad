// Универсальный API клиент с поддержкой JWT
// Фронтендеру не нужно изменять этот файл

import { buildApiUrl } from "@/config/api-endpoints"
import { JWTManager } from "@/lib/jwt-utils"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = JWTManager.getToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      // Если токен истек, очищаем его
      if (response.status === 401) {
        JWTManager.removeToken()
        // Можно добавить редирект на /login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      return {
        success: false,
        error: "Ошибка обработки ответа сервера",
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include", // Для отправки cookies
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: "Ошибка сети",
      }
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: this.getAuthHeaders(),
        credentials: "include", // Для отправки cookies
        body: data ? JSON.stringify(data) : undefined,
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: "Ошибка сети",
      }
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "PUT",
        headers: this.getAuthHeaders(),
        credentials: "include", // Для отправки cookies
        body: data ? JSON.stringify(data) : undefined,
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: "Ошибка сети",
      }
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include", // Для отправки cookies
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: "Ошибка сети",
      }
    }
  }

  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = JWTManager.getToken()
      const headers: HeadersInit = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers,
        credentials: "include", // Для отправки cookies
        body: formData,
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: "Ошибка загрузки файла",
      }
    }
  }
}

export const apiClient = new ApiClient()
