"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/panel")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Перенаправление...</div>
      </div>
    </ThemeProvider>
  )
}
