import { useState, useCallback } from "react"
import { normalizeInvoice, type Invoice } from "@/types/invoice"
import { type SavedInvoice, createSavedInvoice } from "@/types/savedInvoice"

const STORAGE_KEY = "invoice-history"

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function load(): SavedInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedInvoice[]
    return parsed.map((s) => ({ ...s, invoice: normalizeInvoice(s.invoice) }))
  } catch {
    return []
  }
}

function persist(items: SavedInvoice[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useSavedInvoices() {
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(load)

  const saveInvoice = useCallback((title: string, invoice: Invoice) => {
    const snapshot = deepCopy(invoice)
    setSavedInvoices((prev) => {
      const next = [createSavedInvoice(title, snapshot), ...prev]
      persist(next)
      return next
    })
  }, [])

  const renameInvoice = useCallback((id: string, title: string) => {
    setSavedInvoices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, title } : s))
      persist(next)
      return next
    })
  }, [])

  const removeInvoice = useCallback((id: string) => {
    setSavedInvoices((prev) => {
      const next = prev.filter((s) => s.id !== id)
      persist(next)
      return next
    })
  }, [])

  const duplicateInvoice = useCallback((id: string): Invoice | null => {
    let result: Invoice | null = null
    setSavedInvoices((prev) => {
      const found = prev.find((s) => s.id === id)
      if (!found) return prev
      result = deepCopy(found.invoice)
      const next = prev.map((s) =>
        s.id === id ? { ...s, usageCount: s.usageCount + 1 } : s
      )
      persist(next)
      return next
    })
    return result
  }, [])

  return { savedInvoices, saveInvoice, renameInvoice, removeInvoice, duplicateInvoice }
}
