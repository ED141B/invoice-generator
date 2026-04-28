import { Separator } from "@/components/ui/separator"
import { computeTotals, type Invoice } from "@/types/invoice"

interface Props {
  invoice: Invoice
}

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export function InvoicePreview({ invoice }: Props) {
  const { subtotal, tax, total } = computeTotals(invoice.items, invoice.taxRate)

  return (
    <div className="bg-white text-gray-900 rounded-xl border shadow-sm p-8 space-y-8 print:shadow-none print:rounded-none print:border-none">
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FACTURE</h1>
          <p className="text-sm text-gray-500 mt-1">N° {invoice.number || "—"}</p>
        </div>
        <div className="text-right text-sm space-y-0.5">
          <p><span className="text-gray-500">Date :</span> {invoice.date || "—"}</p>
          <p><span className="text-gray-500">Échéance :</span> {invoice.dueDate || "—"}</p>
        </div>
      </div>

      <Separator />

      {/* Émetteur + Client */}
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">De</p>
          <p className="font-semibold">{invoice.sender.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.sender.address}</p>
          {invoice.sender.email && <p className="text-gray-600">{invoice.sender.email}</p>}
          {invoice.sender.phone && <p className="text-gray-600">{invoice.sender.phone}</p>}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">À</p>
          <p className="font-semibold">{invoice.client.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
          {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
        </div>
      </div>

      <Separator />

      {/* Tableau des prestations */}
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-400 text-xs uppercase tracking-wider">
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 font-medium text-right w-16">Qté</th>
              <th className="pb-2 font-medium text-right w-28">Prix unit.</th>
              <th className="pb-2 font-medium text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5">{item.description || <span className="text-gray-300 italic">Sans description</span>}</td>
                <td className="py-2.5 text-right text-gray-600">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-600">{fmt.format(item.unitPrice)}</td>
                <td className="py-2.5 text-right font-medium">{fmt.format(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total HT</span>
            <span>{fmt.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA ({invoice.taxRate}%)</span>
            <span>{fmt.format(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total TTC</span>
            <span>{fmt.format(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <>
          <Separator />
          <div className="text-sm text-gray-600 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes</p>
            <p className="whitespace-pre-line">{invoice.notes}</p>
          </div>
        </>
      )}
    </div>
  )
}
