import type { Invoice } from "./invoice"

export interface SavedInvoice {
  id: string
  title: string
  invoice: Invoice
  savedAt: string
  usageCount: number
}

export function createSavedInvoice(title: string, invoice: Invoice): SavedInvoice {
  return {
    id: crypto.randomUUID(),
    title,
    invoice,
    savedAt: new Date().toISOString(),
    usageCount: 0,
  }
}
