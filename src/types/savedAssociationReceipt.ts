import type { AssociationReceipt } from "./associationReceipt"

export interface SavedAssociationReceipt {
  id: string
  title: string
  receipt: AssociationReceipt
  savedAt: string
  usageCount: number
}

export function createSavedAssociationReceipt(title: string, receipt: AssociationReceipt): SavedAssociationReceipt {
  return {
    id: crypto.randomUUID(),
    title,
    receipt,
    savedAt: new Date().toISOString(),
    usageCount: 0,
  }
}
