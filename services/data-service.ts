// 📊 СЕРВИС ДАННЫХ
// Автоматически переключается между моком и бэкендом

import { BACKEND_CONFIG } from "@/config/backend"
import { api } from "@/lib/api"
import { JWTManager } from "@/lib/jwt-utils"
import { MOCK_USERS, MOCK_CATEGORIES, MOCK_SUBCATEGORIES, MOCK_PRODUCTS, MOCK_COURIERS, MOCK_CITIES } from "./mock-data"
import type { User, Category, Subcategory, Product, Courier } from "@/types"

class DataService {
  // 🔐 Авторизация
  async login(login: string, password: string): Promise<User | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.login(login, password)
      if (response.success) {
        // Декодируем JWT, чтобы получить данные пользователя
        const claims = JWTManager.decodeToken()
        if (claims) {
          return {
            id: claims.user_id || "",
            login: claims.login || login,
            password: "",
            role: claims.isManager !== undefined
              ? claims.isManager
                ? "manager"
                : "courier"
              : claims.role,
            cities: claims.cities,
          }
        }
        return { id: "", login, password: "", role: "manager" }
      }
      return null
    }

    // Мок
    const user = MOCK_USERS.find((u) => u.login === login && u.password === password)
    return user || null
  }

  async logout(): Promise<void> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      await api.logout()
    }
  }

  // 📂 Категории
  async getCategories(): Promise<Category[]> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.get<Category[]>(BACKEND_CONFIG.ENDPOINTS.CATEGORIES)
      return response.success ? response.data : []
    }
    return MOCK_CATEGORIES
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.post<Category>(BACKEND_CONFIG.ENDPOINTS.CATEGORIES, category)
      return response.success ? response.data : null
    }

    // Мок
    const newCategory: Category = { ...category, id: Date.now().toString() }
    MOCK_CATEGORIES.push(newCategory)
    return newCategory
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.put<Category>(`${BACKEND_CONFIG.ENDPOINTS.CATEGORIES}/${id}`, category)
      return response.success ? response.data : null
    }

    // Мок
    const index = MOCK_CATEGORIES.findIndex((c) => c.id === id)
    if (index !== -1) {
      MOCK_CATEGORIES[index] = { ...MOCK_CATEGORIES[index], ...category }
      return MOCK_CATEGORIES[index]
    }
    return null
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.delete(`${BACKEND_CONFIG.ENDPOINTS.CATEGORIES}/${id}`)
      return response.success
    }

    // Мок
    const index = MOCK_CATEGORIES.findIndex((c) => c.id === id)
    if (index !== -1) {
      MOCK_CATEGORIES.splice(index, 1)
      return true
    }
    return false
  }

  // 📂 Подкатегории
  async getSubcategories(): Promise<Subcategory[]> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.get<Subcategory[]>(BACKEND_CONFIG.ENDPOINTS.SUBCATEGORIES)
      return response.success ? response.data : []
    }
    return MOCK_SUBCATEGORIES
  }

  async createSubcategory(subcategory: Omit<Subcategory, "id">): Promise<Subcategory | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.post<Subcategory>(BACKEND_CONFIG.ENDPOINTS.SUBCATEGORIES, subcategory)
      return response.success ? response.data : null
    }

    // Мок
    const newSubcategory: Subcategory = { ...subcategory, id: Date.now().toString() }
    MOCK_SUBCATEGORIES.push(newSubcategory)
    return newSubcategory
  }

  async updateSubcategory(id: string, subcategory: Partial<Subcategory>): Promise<Subcategory | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.put<Subcategory>(`${BACKEND_CONFIG.ENDPOINTS.SUBCATEGORIES}/${id}`, subcategory)
      return response.success ? response.data : null
    }

    // Мок
    const index = MOCK_SUBCATEGORIES.findIndex((s) => s.id === id)
    if (index !== -1) {
      MOCK_SUBCATEGORIES[index] = { ...MOCK_SUBCATEGORIES[index], ...subcategory }
      return MOCK_SUBCATEGORIES[index]
    }
    return null
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.delete(`${BACKEND_CONFIG.ENDPOINTS.SUBCATEGORIES}/${id}`)
      return response.success
    }

    // Мок
    const index = MOCK_SUBCATEGORIES.findIndex((s) => s.id === id)
    if (index !== -1) {
      MOCK_SUBCATEGORIES.splice(index, 1)
      return true
    }
    return false
  }

  // 📦 Товары
  async getProducts(): Promise<Product[]> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.get<Product[]>(BACKEND_CONFIG.ENDPOINTS.PRODUCTS)
      return response.success ? response.data : []
    }
    return MOCK_PRODUCTS
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.post<Product>(BACKEND_CONFIG.ENDPOINTS.PRODUCTS, product)
      return response.success ? response.data : null
    }

    // Мок
    const newProduct: Product = { ...product, id: Date.now().toString() }
    MOCK_PRODUCTS.push(newProduct)
    return newProduct
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.put<Product>(`${BACKEND_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, product)
      return response.success ? response.data : null
    }

    // Мок
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (index !== -1) {
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...product }
      return MOCK_PRODUCTS[index]
    }
    return null
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.delete(`${BACKEND_CONFIG.ENDPOINTS.PRODUCTS}/${id}`)
      return response.success
    }

    // Мок
    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id)
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1)
      return true
    }
    return false
  }

  // 🚚 Курьеры
  async getCouriers(): Promise<Courier[]> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.get<Courier[]>(BACKEND_CONFIG.ENDPOINTS.COURIERS)
      return response.success ? response.data : []
    }
    return MOCK_COURIERS
  }

  async createCourier(courier: Omit<Courier, "id">): Promise<Courier | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.post<Courier>(BACKEND_CONFIG.ENDPOINTS.COURIERS, courier)
      return response.success ? response.data : null
    }

    // Мок
    const newCourier: Courier = { ...courier, id: Date.now().toString() }
    MOCK_COURIERS.push(newCourier)
    return newCourier
  }

  async updateCourier(id: string, courier: Partial<Courier>): Promise<Courier | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.put<Courier>(`${BACKEND_CONFIG.ENDPOINTS.COURIERS}/${id}`, courier)
      return response.success ? response.data : null
    }

    // Мок
    const index = MOCK_COURIERS.findIndex((c) => c.id === id)
    if (index !== -1) {
      MOCK_COURIERS[index] = { ...MOCK_COURIERS[index], ...courier }
      return MOCK_COURIERS[index]
    }
    return null
  }

  async deleteCourier(id: string): Promise<boolean> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.delete(`${BACKEND_CONFIG.ENDPOINTS.COURIERS}/${id}`)
      return response.success
    }

    // Мок
    const index = MOCK_COURIERS.findIndex((c) => c.id === id)
    if (index !== -1) {
      MOCK_COURIERS.splice(index, 1)
      return true
    }
    return false
  }

  // 🏙️ Города
  async getCities(): Promise<string[]> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.get<string[]>("/references/cities")
      return response.success ? response.data : []
    }
    return MOCK_CITIES
  }

  // 📁 Изображения
  async uploadImage(file: File): Promise<string | null> {
    if (BACKEND_CONFIG.USE_BACKEND) {
      const response = await api.uploadFile<{ filename: string }>(BACKEND_CONFIG.ENDPOINTS.IMAGES_UPLOAD, file)
      return response.success ? response.data.filename : null
    }

    // Мок - возвращаем blob URL
    return URL.createObjectURL(file)
  }

  getImageUrl(filename: string): string {
    if (!filename) return "/placeholder.svg"

    if (BACKEND_CONFIG.USE_BACKEND) {
      return `${BACKEND_CONFIG.API_URL}${BACKEND_CONFIG.ENDPOINTS.IMAGES_GET}/${filename}`
    }

    // Мок - возвращаем как есть (blob URL)
    return filename
  }
}

export const dataService = new DataService()
