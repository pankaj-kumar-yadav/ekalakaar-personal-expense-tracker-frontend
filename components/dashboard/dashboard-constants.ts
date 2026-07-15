import {
  ChartNoAxesColumnIcon,
  ReceiptIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

import type { DashboardMetrics, PeriodKey } from "@/lib/types"

export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "this-week", label: "This week" },
  { key: "last-week", label: "Last week" },
]

export const DEFAULT_KPIS: DashboardMetrics["kpis"] = [
  {
    label: "Total Spent",
    value: "0",
    change: 0,
    sparkline: [0],
  },
  {
    label: "Expenses Logged",
    value: "0",
    change: 0,
    sparkline: [0],
  },
  {
    label: "Avg. Expense",
    value: "0",
    change: 0,
    sparkline: [0],
  },
]

const KPI_ICONS: Record<string, LucideIcon> = {
  "Total Spent": WalletIcon,
  "Expenses Logged": ReceiptIcon,
  "Avg. Expense": ChartNoAxesColumnIcon,
}

export function getKpiIcon(label: string): LucideIcon {
  return KPI_ICONS[label] ?? WalletIcon
}

export function isCountKpi(label: string): boolean {
  return label === "Expenses Logged"
}

export function getPeriodLabel(period: PeriodKey): string {
  return PERIOD_OPTIONS.find((option) => option.key === period)?.label ?? "This week"
}
