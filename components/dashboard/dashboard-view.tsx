"use client"

import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting"
import { DashboardKpiGrid } from "@/components/dashboard/dashboard-kpi-grid"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { ExpenseMonitoringTable } from "@/components/dashboard/expense-monitoring-table"
import { useDashboard } from "@/components/dashboard/use-dashboard"
import { useAuth } from "@/lib/auth-context"

export function DashboardView() {
  const { user } = useAuth()
  const {
    period,
    setPeriod,
    metrics,
    chart,
    expenses,
    expenseMeta,
    setExpensePage,
    isLoading,
    isTableLoading,
    error,
    reload,
    onExpenseDeleted,
  } = useDashboard()

  return (
    <div className="flex flex-1 flex-col gap-5 bg-white p-4 md:p-6">
      <DashboardGreeting
        userName={user?.name}
        period={period}
        onPeriodChange={setPeriod}
      />

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="text-destructive">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-2 text-sm font-medium underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : null}

      <DashboardKpiGrid metrics={metrics} isLoading={isLoading} />

      <DashboardOverview chart={chart} isLoading={isLoading} />

      <ExpenseMonitoringTable
        expenses={expenses}
        meta={expenseMeta}
        isLoading={isTableLoading}
        onDeleted={() => void onExpenseDeleted()}
        onPageChange={setExpensePage}
      />
    </div>
  )
}
