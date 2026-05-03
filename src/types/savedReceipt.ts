import type { Receipt } from "./receipt"

export interface SavedReceipt {
  id: string
  title: string
  receipt: Receipt
  savedAt: string
  usageCount: number
}

export function createSavedReceipt(title: string, receipt: Receipt): SavedReceipt {
  return {
    id: crypto.randomUUID(),
    title,
    receipt,
    savedAt: new Date().toISOString(),
    usageCount: 0,
  }
}
