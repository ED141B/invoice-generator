export const RECEIPT_PAYMENT_METHODS = ["Virement bancaire", "Espèces", "CB", "Chèque", "Autre"] as const
export type ReceiptPaymentMethod = typeof RECEIPT_PAYMENT_METHODS[number]

export const TAX_RATES = [0, 5.5, 10, 20] as const

export interface Receipt {
  number: string
  date: string
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
  }
  description: string
  amountHT: number
  taxRate: number
  amountReceived: number
  paymentMethod: ReceiptPaymentMethod
  paymentReference: string
  signature: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export function computeReceiptTotals(amountHT: number, taxRate: number) {
  const tax = round2(amountHT * (taxRate / 100))
  const total = round2(amountHT + tax)
  return { tax, total }
}

export function generateNextReceiptNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear()
  const prefix = `REC-${year}-`
  let max = 0
  for (const n of existingNumbers) {
    if (n.startsWith(prefix)) {
      const seq = parseInt(n.slice(prefix.length), 10)
      if (!isNaN(seq) && seq > max) max = seq
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}

export function normalizeReceipt(data: Partial<Receipt>): Receipt {
  return {
    number: data.number ?? `REC-${new Date().getFullYear()}-001`,
    date: data.date ?? new Date().toISOString().split("T")[0],
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
    },
    description: data.description ?? "",
    amountHT: typeof data.amountHT === "number" ? data.amountHT : 0,
    taxRate: typeof data.taxRate === "number" ? data.taxRate : 20,
    amountReceived: typeof data.amountReceived === "number" ? data.amountReceived : 0,
    paymentMethod: RECEIPT_PAYMENT_METHODS.includes(data.paymentMethod as ReceiptPaymentMethod)
      ? (data.paymentMethod as ReceiptPaymentMethod)
      : "Virement bancaire",
    paymentReference: data.paymentReference ?? "",
    signature: data.signature ?? "",
  }
}

export function createEmptyReceipt(sender?: Receipt["sender"]): Receipt {
  const today = new Date()
  return {
    number: `REC-${today.getFullYear()}-001`,
    date: today.toISOString().split("T")[0],
    sender: sender ?? { name: "", address: "", email: "", phone: "", siret: "", vatNumber: "" },
    client: { name: "", address: "" },
    description: "",
    amountHT: 0,
    taxRate: 20,
    amountReceived: 0,
    paymentMethod: "Virement bancaire",
    paymentReference: "",
    signature: "",
  }
}
