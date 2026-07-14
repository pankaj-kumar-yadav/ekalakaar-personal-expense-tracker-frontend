import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/format"

type TotalSpentProps = {
  total: number
  isLoading?: boolean
}

export function TotalSpent({ total, isLoading = false }: TotalSpentProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Total Spent</CardDescription>
        <CardTitle className="text-2xl">
          {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(total)}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
