"use client"

import {
  DEFAULT_KPIS,
  getKpiIcon,
  isCountKpi,
} from "@/components/dashboard/dashboard-constants"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { formatCurrency } from "@/lib/format"
import type { DashboardMetrics } from "@/lib/types"

type DashboardKpiGridProps = {
  metrics: DashboardMetrics | null
  isLoading: boolean
}

export function DashboardKpiGrid({
  metrics,
  isLoading,
}: DashboardKpiGridProps) {
  const kpis = metrics?.kpis ?? DEFAULT_KPIS

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          sparkline={kpi.sparkline}
          isLoading={isLoading}
          icon={getKpiIcon(kpi.label)}
          formatValue={
            isCountKpi(kpi.label)
              ? undefined
              : (raw) => formatCurrency(Number(raw))
          }
        />
      ))}
    </div>
  )
}
