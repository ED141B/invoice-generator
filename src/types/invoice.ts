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
  }
  client: {
    name: string
    address: string
    email: string
  }
  items: InvoiceItem[]
  notes: string
  taxRate: number
}

export function computeTotals(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
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
    sender: { name: "", address: "", email: "", phone: "" },
    client: { name: "", address: "", email: "" },
    items: [createEmptyItem()],
    notes: "",
    taxRate: 20,
  }
}
