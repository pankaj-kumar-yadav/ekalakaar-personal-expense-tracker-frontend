"use client"

import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import type { DashboardChart } from "@/lib/types"

type DashboardOverviewProps = {
  chart: DashboardChart | null
  isLoading: boolean
}

export function DashboardOverview({
  chart,
  isLoading,
}: DashboardOverviewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <SpendingChart
        total={chart?.total ?? 0}
        change={chart?.change ?? 0}
        days={chart?.days ?? []}
        isLoading={isLoading}
      />
      <ActivityFeed />
    </div>
  )
}
