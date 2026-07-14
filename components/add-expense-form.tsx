"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createExpense } from "@/lib/api"
import { EXPENSE_CATEGORIES, type Expense, type NewExpense } from "@/lib/types"
import { cn } from "@/lib/utils"

type AddExpenseFormProps = {
  onExpenseAdded: (expense: Expense) => void
  className?: string
}

export function AddExpenseForm({
  onExpenseAdded,
  className,
}: AddExpenseFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Amount must be greater than 0.")
      return
    }

    if (!description.trim()) {
      setError("Description is required.")
      return
    }

    const payload: NewExpense = {
      amount: parsedAmount,
      description: description.trim(),
      category,
      date,
    }

    setIsSubmitting(true)
    try {
      const expense = await createExpense(payload)
      onExpenseAdded(expense)
      setAmount("")
      setDescription("")
      setCategory(EXPENSE_CATEGORIES[0])
      setDate(new Date().toISOString().slice(0, 10))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>Record a new expense to track your spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                disabled={isSubmitting}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                type="text"
                placeholder="Coffee, groceries, etc."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                disabled={isSubmitting}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={isSubmitting}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
              >
                {EXPENSE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                disabled={isSubmitting}
              />
            </Field>
            {error ? <FieldError>{error}</FieldError> : null}
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Expense"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
