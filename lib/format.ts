import { format, parseISO } from "date-fns"

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return format(parseISO(date), "d MMM yyyy")
}
