"use client"

import { useEffect, useState } from "react"

import {
  EMPTY_MONITOR_FILTERS,
  type ExpenseMonitorFilters,
} from "@/components/dashboard/expense-monitor-filters"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EXPENSE_CATEGORIES } from "@/lib/types"

type ExpenseMonitorFilterDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  applied: ExpenseMonitorFilters
  onApply: (filters: ExpenseMonitorFilters) => void
  onClear: () => void
}

export function ExpenseMonitorFilterDialog({
  open,
  onOpenChange,
  applied,
  onApply,
  onClear,
}: ExpenseMonitorFilterDialogProps) {
  const [draft, setDraft] = useState<ExpenseMonitorFilters>(EMPTY_MONITOR_FILTERS)

  useEffect(() => {
    if (open) {
      setDraft({
        categories: [...applied.categories],
        from: applied.from,
        to: applied.to,
      })
    }
  }, [open, applied])

  function toggleCategory(category: string) {
    setDraft((current) => {
      const selected = current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category]
      return { ...current, categories: selected }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter expenses</DialogTitle>
          <DialogDescription>
            Narrow the current page by category and date range. Leave fields
            empty to skip that filter.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium">Categories</p>
            <div className="grid gap-2">
              {EXPENSE_CATEGORIES.map((category) => {
                const id = `monitor-filter-${category}`
                const checked = draft.categories.includes(category)
                return (
                  <Label
                    key={category}
                    htmlFor={id}
                    className="cursor-pointer font-normal"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(category)}
                      className="size-3.5 accent-primary"
                    />
                    {category}
                  </Label>
                )
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="monitor-filter-from">From</Label>
              <Input
                id="monitor-filter-from"
                type="date"
                value={draft.from}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    from: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="monitor-filter-to">To</Label>
              <Input
                id="monitor-filter-to"
                type="date"
                value={draft.to}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    to: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onClear()
              onOpenChange(false)
            }}
          >
            Clear
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onApply({
                  categories: [...draft.categories],
                  from: draft.from,
                  to: draft.to,
                })
                onOpenChange(false)
              }}
            >
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
