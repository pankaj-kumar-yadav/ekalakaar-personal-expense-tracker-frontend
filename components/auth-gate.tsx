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
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (mode === "protected" && !user) {
      router.replace("/")
      return
    }

    if (mode === "public" && user) {
      router.replace("/dashboard")
    }
  }, [isLoading, mode, router, user])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (mode === "protected" && !user) {
    return null
  }

  if (mode === "public" && user) {
    return null
  }

  return children
}
