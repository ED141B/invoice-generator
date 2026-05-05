import { useState, useCallback } from "react"
import { normalizeExpenseReport, type ExpenseReport } from "@/types/expense"
import { type SavedExpense, createSavedExpense } from "@/types/savedExpense"

const STORAGE_KEY = "expense-history"

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function load(): SavedExpense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedExpense[]
    return parsed.map((s) => ({ ...s, expense: normalizeExpenseReport(s.expense) }))
  } catch {
    return []
  }
}

function persist(items: SavedExpense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useSavedExpenses() {
  const [savedExpenses, setSavedExpenses] = useState<SavedExpense[]>(load)

  const saveExpense = useCallback((title: string, expense: ExpenseReport) => {
    const snapshot = deepCopy(expense)
    setSavedExpenses((prev) => {
      const next = [createSavedExpense(title, snapshot), ...prev]
      persist(next)
      return next
    })
  }, [])

  const renameExpense = useCallback((id: string, title: string) => {
    setSavedExpenses((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, title } : s))
      persist(next)
      return next
    })
  }, [])

  const removeExpense = useCallback((id: string) => {
    setSavedExpenses((prev) => {
      const next = prev.filter((s) => s.id !== id)
      persist(next)
      return next
    })
  }, [])

  const duplicateExpense = useCallback((id: string): ExpenseReport | null => {
    let result: ExpenseReport | null = null
    setSavedExpenses((prev) => {
      const found = prev.find((s) => s.id === id)
      if (!found) return prev
      result = deepCopy(found.expense)
      const next = prev.map((s) =>
        s.id === id ? { ...s, usageCount: s.usageCount + 1 } : s
      )
      persist(next)
      return next
    })
    return result
  }, [])

  return { savedExpenses, saveExpense, renameExpense, removeExpense, duplicateExpense }
}
