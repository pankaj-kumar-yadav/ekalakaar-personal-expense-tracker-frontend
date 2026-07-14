import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpenseTracker } from "@/components/expense-tracker/expense-tracker"

export default function ExpensesPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Expenses" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Add, view, and delete your expenses.
          </p>
        </div>
        <ExpenseTracker />
      </div>
    </>
  )
}
