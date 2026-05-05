import type { ExpenseReport } from "./expense"

export interface SavedExpense {
  id: string
  title: string
  expense: ExpenseReport
  savedAt: string
  usageCount: number
}

export function createSavedExpense(title: string, expense: ExpenseReport): SavedExpense {
  return {
    id: crypto.randomUUID(),
    title,
    expense,
    savedAt: new Date().toISOString(),
    usageCount: 0,
  }
}
