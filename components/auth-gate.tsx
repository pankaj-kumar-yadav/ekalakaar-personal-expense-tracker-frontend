"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuth } from "@/lib/auth-context"

type AuthGateProps = {
  mode: "protected" | "public"
  children: React.ReactNode
}

export function AuthGate({ mode, children }: AuthGateProps) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Memory-only session: redirect home→dashboard only when login just set user.
    // Protected routes rely on the jwt cookie + API 401 handling, not on user state.
    if (mode === "public" && user) {
      router.replace("/dashboard")
    }
  }, [mode, router, user])

  if (mode === "public" && user) {
    return null
  }

  return children
}
