export const SWISS_TAX_RATES = [0, 2.6, 3.8, 8.1] as const
export type SwissTaxRate = typeof SWISS_TAX_RATES[number]

export const EXPENSE_CATEGORIES = [
  "Repas / Restauration",
  "Transport",
  "Hébergement",
  "Fournitures de bureau",
  "Formation",
  "Frais de représentation",
  "Téléphone / Communication",
  "Autre",
] as const
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

export const EXPENSE_PAYMENT_METHODS = [
  "Carte d'entreprise",
  "Espèces",
  "Carte personnelle",
  "Virement",
  "Autre",
] as const
export type ExpensePaymentMethod = typeof EXPENSE_PAYMENT_METHODS[number]

export const EXPENSE_PAYMENT_TYPES = [
  "Avancée par un membre",
  "Payée par l'association",
] as const
export type ExpensePaymentType = typeof EXPENSE_PAYMENT_TYPES[number]

export const BUDGET_POSTS = [
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
export type BudgetPost = typeof BUDGET_POSTS[number]

export interface ExpenseItem {
  id: string
  date: string
  category: ExpenseCategory
  description: string
  amountHT: number
  taxRate: SwissTaxRate
  receiptRef: string
  paymentMethod: ExpensePaymentMethod
  paymentType: ExpensePaymentType
}

export interface ExpenseReport {
  number: string
  periodStart: string
  periodEnd: string
  company: {
    name: string
    address: string
    vatNumber: string
    email: string
    phone: string
  }
  employee: {
    name: string
    role: string
    iban: string
  }
  project: string
  validatedBy: string
  budgetPost: string
  associativeReason: string
  vatExempt: boolean
  archiveDate: string
  items: ExpenseItem[]
  notes: string
  currency: "CHF"
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export function computeItemTTC(amountHT: number, taxRate: number) {
  return round2(amountHT * (1 + taxRate / 100))
}

export function computeExpenseTotals(items: ExpenseItem[]) {
  const totalHT = round2(items.reduce((sum, item) => sum + item.amountHT, 0))
  const totalTTC = round2(items.reduce((sum, item) => sum + computeItemTTC(item.amountHT, item.taxRate), 0))
  const totalTVA = round2(totalTTC - totalHT)
  return { totalHT, totalTVA, totalTTC }
}

export function createEmptyExpenseItem(): ExpenseItem {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
    category: "Autre",
    description: "",
    amountHT: 0,
    taxRate: 8.1,
    receiptRef: "",
    paymentMethod: "Carte d'entreprise",
    paymentType: "Avancée par un membre",
  }
}

export function computeArchiveDate(periodEnd: string): string {
  if (!periodEnd) return ""
  const d = new Date(periodEnd)
  d.setFullYear(d.getFullYear() + 10)
  return d.toISOString().split("T")[0]
}

export function generateNextExpenseNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear()
  const prefix = `NDF-${year}-`
  let max = 0
  for (const n of existingNumbers) {
    if (n.startsWith(prefix)) {
      const seq = parseInt(n.slice(prefix.length), 10)
      if (!isNaN(seq) && seq > max) max = seq
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

export function normalizeExpenseReport(data: Partial<ExpenseReport>): ExpenseReport {
  const today = new Date().toISOString().split("T")[0]
  const periodEnd = data.periodEnd ?? today
  return {
    number: data.number ?? `NDF-${new Date().getFullYear()}-001`,
    periodStart: data.periodStart ?? today,
    periodEnd,
    company: {
      name: data.company?.name ?? "",
      address: data.company?.address ?? "",
      vatNumber: data.company?.vatNumber ?? "",
      email: data.company?.email ?? "",
      phone: data.company?.phone ?? "",
    },
    employee: {
      name: data.employee?.name ?? "",
      role: data.employee?.role ?? "",
      iban: data.employee?.iban ?? "",
    },
    project: data.project ?? "",
    validatedBy: data.validatedBy ?? "",
    budgetPost: data.budgetPost ?? "",
    associativeReason: data.associativeReason ?? "",
    vatExempt: data.vatExempt ?? false,
    archiveDate: data.archiveDate ?? computeArchiveDate(periodEnd),
    items: data.items?.length
      ? data.items.map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          date: item.date ?? today,
          category: EXPENSE_CATEGORIES.includes(item.category as ExpenseCategory)
            ? (item.category as ExpenseCategory)
            : "Autre",
          description: item.description ?? "",
          amountHT: typeof item.amountHT === "number" ? item.amountHT : 0,
          taxRate: SWISS_TAX_RATES.includes(item.taxRate as SwissTaxRate)
            ? (item.taxRate as SwissTaxRate)
            : 8.1,
          receiptRef: item.receiptRef ?? "",
          paymentMethod: EXPENSE_PAYMENT_METHODS.includes(item.paymentMethod as ExpensePaymentMethod)
            ? (item.paymentMethod as ExpensePaymentMethod)
            : "Carte d'entreprise",
          paymentType: EXPENSE_PAYMENT_TYPES.includes(item.paymentType as ExpensePaymentType)
            ? (item.paymentType as ExpensePaymentType)
            : "Avancée par un membre",
        }))
      : [createEmptyExpenseItem()],
    notes: data.notes ?? "",
    currency: "CHF",
  }
}

export function createEmptyExpenseReport(): ExpenseReport {
  const today = new Date().toISOString().split("T")[0]
  return {
    number: `NDF-${new Date().getFullYear()}-001`,
    periodStart: today,
    periodEnd: today,
    company: { name: "", address: "", vatNumber: "", email: "", phone: "" },
    employee: { name: "", role: "", iban: "" },
    project: "",
    validatedBy: "",
    budgetPost: "",
    associativeReason: "",
    vatExempt: false,
    archiveDate: computeArchiveDate(today),
    items: [createEmptyExpenseItem()],
    notes: "",
    currency: "CHF",
  }
}
