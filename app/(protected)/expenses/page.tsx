import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpenseTracker } from "@/components/expense-tracker/expense-tracker"

export default function ExpensesPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Expenses" }]} />
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, review, and remove expenses in one place.
          </p>
        </div>
        <ExpenseTracker />
      </div>
    </>
  )
}
