"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/layout/sidebar"
import { CategoriesPage } from "@/components/pages/categories-page"
import { SubcategoriesPage } from "@/components/pages/subcategories-page"
import { ProductsPage } from "@/components/pages/products-page"
import { ProductsPageCourier } from "@/components/pages/products-page-courier"
import { CouriersPage } from "@/components/pages/couriers-page"
import { CitiesPage } from "@/components/pages/cities-page"

export function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("categories")

  const renderContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoriesPage />
      case "subcategories":
        return <SubcategoriesPage />
      case "products":
        return user?.role === "courier" ? <ProductsPageCourier /> : <ProductsPage />
      case "couriers":
        return <CouriersPage />
      case "cities":
        return <CitiesPage />
      default:
        return <CategoriesPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole={user?.role || "manager"} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
