import { useState, useCallback } from "react"
import { normalizeAssociationReceipt, generateNextArNumber, type AssociationReceipt } from "@/types/associationReceipt"
import { type SavedAssociationReceipt, createSavedAssociationReceipt } from "@/types/savedAssociationReceipt"

const STORAGE_KEY = "association-receipt-history"

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function load(): SavedAssociationReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is SavedAssociationReceipt => s !== null && typeof s === "object" && "receipt" in s)
      .map((s) => ({
        id: typeof s.id === "string" ? s.id : crypto.randomUUID(),
        title: typeof s.title === "string" ? s.title : "",
        savedAt: typeof s.savedAt === "string" ? s.savedAt : new Date().toISOString(),
        usageCount: typeof s.usageCount === "number" ? s.usageCount : 0,
        receipt: normalizeAssociationReceipt(s.receipt),
      }))
  } catch {
    return []
  }
}

function persist(items: SavedAssociationReceipt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

export function useSavedAssociationReceipts() {
  const [savedAssociationReceipts, setSavedAssociationReceipts] = useState<SavedAssociationReceipt[]>(load)

  const saveAssociationReceipt = useCallback((title: string, receipt: AssociationReceipt) => {
    const snapshot = deepCopy(receipt)
    setSavedAssociationReceipts((prev) => {
      const next = [createSavedAssociationReceipt(title, snapshot), ...prev]
      persist(next)
      return next
    })
  }, [])

  const renameAssociationReceipt = useCallback((id: string, title: string) => {
    setSavedAssociationReceipts((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, title } : s))
      persist(next)
      return next
    })
  }, [])

  const removeAssociationReceipt = useCallback((id: string) => {
    setSavedAssociationReceipts((prev) => {
      const next = prev.filter((s) => s.id !== id)
      persist(next)
      return next
    })
  }, [])

  const duplicateAssociationReceipt = useCallback((id: string): AssociationReceipt | null => {
    let result: AssociationReceipt | null = null
    setSavedAssociationReceipts((prev) => {
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

  const cloneSavedAssociationReceipt = useCallback((id: string) => {
    setSavedAssociationReceipts((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      const found = prev[idx]
      const existingNumbers = prev.map((s) => s.receipt.number)
      const newNumber = generateNextArNumber(existingNumbers)
      const cloned = createSavedAssociationReceipt(found.title, { ...deepCopy(found.receipt), number: newNumber })
      const next = [...prev.slice(0, idx + 1), cloned, ...prev.slice(idx + 1)]
      persist(next)
      return next
    })
  }, [])

  return {
    savedAssociationReceipts,
    saveAssociationReceipt,
    renameAssociationReceipt,
    removeAssociationReceipt,
    duplicateAssociationReceipt,
    cloneSavedAssociationReceipt,
  }
}
