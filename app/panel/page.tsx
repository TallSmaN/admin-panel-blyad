"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminPanel } from "@/components/admin-panel"
import { ThemeProvider } from "@/components/theme-provider"

export default function PanelPage() {
  const { isAuthenticated, isLoading } = useAuth()
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

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Перенаправление...</div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AdminPanel />
    </ThemeProvider>
  )
}
