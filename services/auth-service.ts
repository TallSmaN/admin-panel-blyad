import type { User } from "@/types"
import { apiClient } from "./api-client"
import { API_CONFIG } from "@/config/api-endpoints"
import { JWTManager, type JWTClaims } from "@/lib/jwt-utils"

class AuthService {
  // Флаг для переключения между моком и API
  private USE_API = false // Фронтендер меняет на true для подключения бэкенда

  // Моковые данные для разработки
  private users: User[] = [
    {
      id: "1",
      login: "manager",
      password: "manager123",
      role: "manager",
    },
    {
      id: "2",
      login: "courier1",
      password: "courier123",
      role: "courier",
      cities: ["Bocholt", "Köln"],
    },
  ]

  // Преобразование JWT claims в User объект
  private claimsToUser(claims: JWTClaims): User {
    return {
      id: claims.user_id,
      login: claims.login,
      password: "", // Пароль не передается в JWT
      role: claims.role,
      cities: claims.cities || [],
    }
  }

  async login(login: string, password: string): Promise<User | null> {
    if (this.USE_API) {
      const response = await apiClient.post<{ token: string }>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        login,
        password,
      })

      if (response.success && response.data?.token) {
        // Сохраняем JWT в secure cookie
        JWTManager.setToken(response.data.token)

        // Декодируем токен для получения данных пользователя
        const claims = JWTManager.decodeToken(response.data.token)
        if (claims) {
          return this.claimsToUser(claims)
        }
      }
      return null
    }

    // Мок для разработки
    const user = this.users.find((u) => u.login === login && u.password === password)
    if (user) {
      // Создаем мок JWT токен для разработки
      const mockToken = this.createMockJWT(user)
      JWTManager.setToken(mockToken)
      return user
    }
    return null
  }

  async logout(): Promise<void> {
    if (this.USE_API) {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
    }

    // Удаляем JWT из cookie
    JWTManager.removeToken()
  }

  getCurrentUser(): User | null {
    const claims = JWTManager.getUserFromToken()
    if (!claims) return null

    return this.claimsToUser(claims)
  }

  isAuthenticated(): boolean {
    return JWTManager.isAuthenticated()
  }

  // Создание мок JWT для разработки
  private createMockJWT(user: User): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(
      JSON.stringify({
        user_id: user.id,
        login: user.login,
        role: user.role,
        cities: user.cities || [],
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 часа
        iat: Math.floor(Date.now() / 1000),
      }),
    )
    const signature = btoa("mock-signature")

    return `${header}.${payload}.${signature}`
  }
}

export const authService = new AuthService()
