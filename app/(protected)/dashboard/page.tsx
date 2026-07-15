import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <DashboardView />
    </>
  )
}
