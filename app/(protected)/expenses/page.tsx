import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExpenseTracker } from "@/components/expense-tracker/expense-tracker"

export default function ExpensesPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Expenses" }]} />
      <div className="flex flex-1 flex-col gap-5 bg-white p-4 md:p-6">
        <ExpenseTracker />
      </div>
    </>
  )
}
