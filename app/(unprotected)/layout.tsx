import { AuthGate } from "@/components/auth-gate"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate mode="public">
      <div className="relative min-h-svh">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </AuthGate>
  )
}
