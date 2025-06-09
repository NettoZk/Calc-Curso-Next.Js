"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function useAdminGuard() {
  const { usuario, isLoading, canAccessAdminFeatures } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && usuario && !canAccessAdminFeatures()) {
      router.push("/acesso-negado")
    }
  }, [usuario, isLoading, canAccessAdminFeatures, router])

  return { isLoading, canAccess: canAccessAdminFeatures() }
}
