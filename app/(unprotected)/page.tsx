"use client"

import { LoginForm } from "@/components/login-form"
import { APP_INFO } from "@/lib/app-info"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--muted)_0%,_var(--background)_55%)] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            {APP_INFO.name}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
