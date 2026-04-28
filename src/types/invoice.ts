export const PAYMENT_METHODS = ["Virement bancaire", "Chèque", "CB"] as const
export type PaymentMethod = typeof PAYMENT_METHODS[number]

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  number: string
  date: string
  dueDate: string
  sender: {
    name: string
    address: string
    email: string
    phone: string
    siret: string
    vatNumber: string
  }
  client: {
    name: string
    address: string
    email: string
  }
  items: InvoiceItem[]
  notes: string
  taxRate: number
  paymentMethod: PaymentMethod
  iban: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export function computeTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = round2(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))
  const tax = round2(subtotal * (taxRate / 100))
  const total = round2(subtotal + tax)
  return { subtotal, tax, total }
}

export function createEmptyItem(): InvoiceItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }
}

export function createEmptyInvoice(): Invoice {
  const today = new Date()
  const due = new Date(today)
  due.setDate(due.getDate() + 30)

  return {
    number: `FAC-${today.getFullYear()}-001`,
    date: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    sender: { name: "", address: "", email: "", phone: "", siret: "", vatNumber: "" },
    client: { name: "", address: "", email: "" },
    items: [createEmptyItem()],
    notes: "",
    taxRate: 20,
    paymentMethod: "Virement bancaire",
    iban: "",
  }
}
