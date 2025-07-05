"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/layout/sidebar"
import { CategoriesPage } from "@/components/pages/categories-page"
import { SubcategoriesPage } from "@/components/pages/subcategories-page"
import { ProductsPage } from "@/components/pages/products-page"
import { CouriersPage } from "@/components/pages/couriers-page"
import { CitiesPage } from "@/components/pages/cities-page"
import { ThemeProvider } from "@/components/theme-provider"

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("categories")
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Загрузка...</div>
        </div>
      </ThemeProvider>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Перенаправление...</div>
        </div>
      </ThemeProvider>
    )
  }

  // Установка начальной страницы в зависимости от роли
  const getInitialPage = () => {
    if (user.role === "manager") {
      return currentPage === "categories" ? "categories" : currentPage
    } else {
      return currentPage === "products" || currentPage === "cities" ? currentPage : "products"
    }
  }

  const renderPage = () => {
    const page = getInitialPage()

    switch (page) {
      case "categories":
        return user.role === "manager" ? <CategoriesPage /> : null
      case "subcategories":
        return user.role === "manager" ? <SubcategoriesPage /> : null
      case "products":
        return <ProductsPage user={user} />
      case "couriers":
        return user.role === "manager" ? <CouriersPage /> : null
      case "cities":
        return user.role === "courier" ? <CitiesPage user={user} /> : null
      default:
        return user.role === "manager" ? <CategoriesPage /> : <ProductsPage user={user} />
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        <Sidebar user={user} currentPage={getInitialPage()} onPageChange={setCurrentPage} onLogout={handleLogout} />
        <main className="md:pl-64">
          <div className="p-6 pt-16 md:pt-6">{renderPage()}</div>
        </main>
      </div>
    </ThemeProvider>
  )
}
