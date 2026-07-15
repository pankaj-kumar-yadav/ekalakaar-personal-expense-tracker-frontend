import { AuthGate } from "@/components/auth-gate"

export default function UnprotectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGate mode="public">{children}</AuthGate>
}
