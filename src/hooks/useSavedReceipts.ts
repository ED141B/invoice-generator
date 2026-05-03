import { useState, useCallback } from "react"
import { normalizeReceipt, type Receipt } from "@/types/receipt"
import { type SavedReceipt, createSavedReceipt } from "@/types/savedReceipt"

const STORAGE_KEY = "receipt-history"

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function load(): SavedReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedReceipt[]
    return parsed.map((s) => ({ ...s, receipt: normalizeReceipt(s.receipt) }))
  } catch {
    return []
  }
}

function persist(items: SavedReceipt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useSavedReceipts() {
  const [savedReceipts, setSavedReceipts] = useState<SavedReceipt[]>(load)

  const saveReceipt = useCallback((title: string, receipt: Receipt) => {
    const snapshot = deepCopy(receipt)
    setSavedReceipts((prev) => {
      const next = [createSavedReceipt(title, snapshot), ...prev]
      persist(next)
      return next
    })
  }, [])

  const renameReceipt = useCallback((id: string, title: string) => {
    setSavedReceipts((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, title } : s))
      persist(next)
      return next
    })
  }, [])

  const removeReceipt = useCallback((id: string) => {
    setSavedReceipts((prev) => {
      const next = prev.filter((s) => s.id !== id)
      persist(next)
      return next
    })
  }, [])

  const duplicateReceipt = useCallback((id: string): Receipt | null => {
    let result: Receipt | null = null
    setSavedReceipts((prev) => {
      const found = prev.find((s) => s.id === id)
      if (!found) return prev
      result = deepCopy(found.receipt)
      const next = prev.map((s) =>
        s.id === id ? { ...s, usageCount: s.usageCount + 1 } : s
      )
      persist(next)
      return next
    })
    return result
  }, [])

  return { savedReceipts, saveReceipt, renameReceipt, removeReceipt, duplicateReceipt }
}
