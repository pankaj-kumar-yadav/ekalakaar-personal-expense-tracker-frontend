import { AppFooter } from "@/components/app-footer"
import { AuthGate } from "@/components/auth-gate"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate mode="protected">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {children}
          <AppFooter />
        </SidebarInset>
      </SidebarProvider>
    </AuthGate>
  )
}
