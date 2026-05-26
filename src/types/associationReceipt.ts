export const SWISS_TAX_RATES_AR = [0, 2.6, 3.8, 8.1] as const
export type SwissTaxRateAr = typeof SWISS_TAX_RATES_AR[number]

export const AR_BUDGET_POSTS = [
  "Administration",
  "Communication",
  "Événement / Manifestation",
  "Formation",
  "Matériel / Fournitures",
  "Transport / Déplacement",
  "Hébergement",
  "Frais bancaires",
  "Autre",
] as const
export type ArBudgetPost = typeof AR_BUDGET_POSTS[number]

export const AR_PAYMENT_METHODS = [
  "Avancée personnelle",
  "Espèces",
  "Carte personnelle",
  "Virement",
  "Autre",
] as const
export type ArPaymentMethod = typeof AR_PAYMENT_METHODS[number]

export interface AssociationReceiptItem {
  id: string
  date: string
  description: string
  amountHT: number
  taxRate: SwissTaxRateAr
  receiptRef: string
  paymentMethod: ArPaymentMethod
}

export interface AssociationReceipt {
  number: string
  date: string
  association: {
    name: string
    address: string
    email: string
    phone: string
    memberNumber: string
  }
  requester: {
    name: string
    role: string
    signature: string
  }
  associativeReason: string
  budgetPost: string
  validatedBy: string
  vatExempt: boolean
  items: AssociationReceiptItem[]
  currency: "CHF"
  archiveDate: string
  notes: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export function computeArItemTTC(amountHT: number, taxRate: number) {
  return round2(amountHT * (1 + taxRate / 100))
}

export function computeArTotals(items: AssociationReceiptItem[]) {
  const totalHT = round2(items.reduce((sum, item) => sum + item.amountHT, 0))
  const totalTTC = round2(items.reduce((sum, item) => sum + computeArItemTTC(item.amountHT, item.taxRate), 0))
  const totalTVA = round2(totalTTC - totalHT)
  return { totalHT, totalTVA, totalTTC }
}

export function computeArArchiveDate(date: string): string {
  if (!date) return ""
  const d = new Date(date + "T00:00:00")
  const y = d.getFullYear() + 10
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function createEmptyArItem(): AssociationReceiptItem {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    description: "",
    amountHT: 0,
    taxRate: 8.1,
    receiptRef: "",
    paymentMethod: "Avancée personnelle",
  }
}

export function generateNextArNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear()
  const prefix = `RAS-${year}-`
  let max = 0
  for (const n of existingNumbers) {
    if (n.startsWith(prefix)) {
      const seq = parseInt(n.slice(prefix.length), 10)
      if (!isNaN(seq) && seq > max) max = seq
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

export function normalizeAssociationReceipt(data: Partial<AssociationReceipt>): AssociationReceipt {
  const today = new Date().toISOString().split("T")[0]
  const date = data.date ?? today
  return {
    number: data.number ?? `RAS-${new Date().getFullYear()}-001`,
    date,
    association: {
      name: data.association?.name ?? "",
      address: data.association?.address ?? "",
      email: data.association?.email ?? "",
      phone: data.association?.phone ?? "",
      memberNumber: data.association?.memberNumber ?? "",
    },
    requester: {
      name: data.requester?.name ?? "",
      role: data.requester?.role ?? "",
      signature: data.requester?.signature ?? "",
    },
    associativeReason: data.associativeReason ?? "",
    budgetPost: AR_BUDGET_POSTS.includes(data.budgetPost as ArBudgetPost)
      ? (data.budgetPost as ArBudgetPost)
      : "",
    validatedBy: data.validatedBy ?? "",
    vatExempt: data.vatExempt ?? false,
    items: data.items?.length
      ? data.items.map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          date: item.date ?? today,
          description: item.description ?? "",
          amountHT: typeof item.amountHT === "number" ? item.amountHT : 0,
          taxRate: SWISS_TAX_RATES_AR.includes(item.taxRate as SwissTaxRateAr)
            ? (item.taxRate as SwissTaxRateAr)
            : 8.1,
          receiptRef: item.receiptRef ?? "",
          paymentMethod: AR_PAYMENT_METHODS.includes(item.paymentMethod as ArPaymentMethod)
            ? (item.paymentMethod as ArPaymentMethod)
            : "Avancée personnelle",
        }))
      : [createEmptyArItem()],
    currency: "CHF",
    archiveDate: data.archiveDate ?? computeArArchiveDate(date),
    notes: data.notes ?? "",
  }
}

export function createEmptyAssociationReceipt(): AssociationReceipt {
  const today = new Date().toISOString().split("T")[0]
  return {
    number: `RAS-${new Date().getFullYear()}-001`,
    date: today,
    association: { name: "", address: "", email: "", phone: "", memberNumber: "" },
    requester: { name: "", role: "", signature: "" },
    associativeReason: "",
    budgetPost: "",
    validatedBy: "",
    vatExempt: false,
    items: [createEmptyArItem()],
    currency: "CHF",
    archiveDate: computeArArchiveDate(today),
    notes: "",
  }
}
