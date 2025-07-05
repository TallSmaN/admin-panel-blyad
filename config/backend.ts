// 🔧 КОНФИГУРАЦИЯ БЭКЕНДА
// Фронтендеру нужно изменить только этот файл!

export const BACKEND_CONFIG = {
  // 📍 Включить/выключить бэкенд (false = мок данные)
  USE_BACKEND: false,

  // 🌐 URL бэкенда
  API_URL: "http://localhost:3001/api",

  // 📋 Эндпоинты (можно менять пути)
  ENDPOINTS: {
    LOGIN: "/auth/login", // POST: { login, password } → { token }
    LOGOUT: "/auth/logout", // POST: {} → {}

    CATEGORIES: "/categories", // GET, POST, PUT, DELETE
    SUBCATEGORIES: "/subcategories", // GET, POST, PUT, DELETE
    PRODUCTS: "/products", // GET, POST, PUT, DELETE
    COURIERS: "/couriers", // GET, POST, PUT, DELETE

    IMAGES_UPLOAD: "/images/upload", // POST: FormData → { filename }
    IMAGES_GET: "/images", // GET: /images/:filename
  },

  // ⚙️ Настройки
  SETTINGS: {
    TOKEN_COOKIE_NAME: "auth_token",
    TOKEN_EXPIRES_HOURS: 24,
  },
}
