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

export function generateNextInvoiceNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear()
  const prefix = `FAC-${year}-`
  let max = 0
  for (const n of existingNumbers) {
    if (n.startsWith(prefix)) {
      const seq = parseInt(n.slice(prefix.length), 10)
      if (!isNaN(seq) && seq > max) max = seq
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

export function normalizeInvoice(data: Partial<Invoice>): Invoice {
  return {
    number: data.number ?? `FAC-${new Date().getFullYear()}-001`,
    date: data.date ?? new Date().toISOString().split("T")[0],
    dueDate: data.dueDate ?? (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0] })(),
    sender: {
      name: data.sender?.name ?? "",
      address: data.sender?.address ?? "",
      email: data.sender?.email ?? "",
      phone: data.sender?.phone ?? "",
      siret: data.sender?.siret ?? "",
      vatNumber: data.sender?.vatNumber ?? "",
    },
    client: {
      name: data.client?.name ?? "",
      address: data.client?.address ?? "",
      email: data.client?.email ?? "",
    },
    items: data.items?.length
      ? data.items.map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          description: item.description ?? "",
          quantity: typeof item.quantity === "number" ? item.quantity : 1,
          unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : 0,
        }))
      : [createEmptyItem()],
    notes: data.notes ?? "",
    taxRate: typeof data.taxRate === "number" ? data.taxRate : 20,
    paymentMethod: PAYMENT_METHODS.includes(data.paymentMethod as PaymentMethod)
      ? (data.paymentMethod as PaymentMethod)
      : "Virement bancaire",
    iban: data.iban ?? "",
  }
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
