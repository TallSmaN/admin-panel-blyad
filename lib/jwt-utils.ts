import { jwtDecode } from "jwt-decode"

export interface JWTClaims {
  user_id: string
  login: string
  role: "manager" | "courier"
  isManager?: boolean
  cities?: string[]
  exp: number
  iat: number
}

export class JWTManager {
  private static readonly COOKIE_NAME = "auth_token"
  private static readonly COOKIE_OPTIONS = {
    httpOnly: false, // Нужен доступ из JS для декодирования
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 часа
    path: "/",
  }

  // Сохранение JWT в secure cookie
  static setToken(token: string): void {
    if (typeof window === "undefined") return

    // Для клиентской стороны используем document.cookie
    const cookieValue = `${this.COOKIE_NAME}=${token}; path=/; max-age=${this.COOKIE_OPTIONS.maxAge}; ${
      this.COOKIE_OPTIONS.secure ? "secure;" : ""
    } samesite=${this.COOKIE_OPTIONS.sameSite}`

    document.cookie = cookieValue
  }

  // Получение JWT из cookie
  static getToken(): string | null {
    if (typeof window === "undefined") return null

    const cookies = document.cookie.split(";")
    const authCookie = cookies.find((cookie) => cookie.trim().startsWith(`${this.COOKIE_NAME}=`))

    if (!authCookie) return null

    return authCookie.split("=")[1].trim()
  }

  // Удаление JWT из cookie
  static removeToken(): void {
    if (typeof window === "undefined") return

    document.cookie = `${this.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }

  // Декодирование JWT без валидации (валидация на бэкенде)
  static decodeToken(token?: string): JWTClaims | null {
    try {
      const jwt = token || this.getToken()
      if (!jwt) return null

      const decoded = jwtDecode<JWTClaims>(jwt)
      return decoded
    } catch (error) {
      console.error("Ошибка декодирования JWT:", error)
      return null
    }
  }

  // Проверка истечения токена (клиентская проверка)
  static isTokenExpired(token?: string): boolean {
    const claims = this.decodeToken(token)
    if (!claims) return true

    const now = Math.floor(Date.now() / 1000)
    return claims.exp < now
  }

  // Получение данных пользователя из JWT
  static getUserFromToken(): JWTClaims | null {
    const token = this.getToken()
    if (!token || this.isTokenExpired(token)) {
      this.removeToken()
      return null
    }

    return this.decodeToken(token)
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null && !this.isTokenExpired(token)
  }
}
