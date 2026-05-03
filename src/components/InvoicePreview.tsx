import { Separator } from "@/components/ui/separator"
import { computeTotals, type Invoice } from "@/types/invoice"
import { formatDate } from "@/lib/utils"

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
          <p><span className="text-gray-500">Date d'émission :</span> {formatDate(invoice.date)}</p>
          <p><span className="text-gray-500">Date d'échéance :</span> {formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      <Separator />

      {/* Émetteur + Client */}
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Émetteur</p>
          <p className="font-semibold">{invoice.sender.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.sender.address}</p>
          {invoice.sender.siret && (
            <p className="text-gray-600">SIRET : {invoice.sender.siret}</p>
          )}
          {invoice.sender.vatNumber && (
            <p className="text-gray-600">N° TVA : {invoice.sender.vatNumber}</p>
          )}
          {invoice.sender.email && <p className="text-gray-600">{invoice.sender.email}</p>}
          {invoice.sender.phone && <p className="text-gray-600">{invoice.sender.phone}</p>}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Client</p>
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
              <th className="pb-2 font-medium">Désignation</th>
              <th className="pb-2 font-medium text-right w-16">Qté</th>
              <th className="pb-2 font-medium text-right w-28">Prix unit. HT</th>
              <th className="pb-2 font-medium text-right w-28">Total HT</th>
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

      <Separator />

      {/* CONDITIONS DE PAIEMENT */}
      <div className="space-y-2 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">1. Conditions de paiement</p>
        <div className="text-gray-700 space-y-1">
          <p><span className="font-medium">Date d'échéance :</span> {formatDate(invoice.dueDate)}</p>
          <p><span className="font-medium">Mode de paiement :</span> {invoice.paymentMethod}</p>
          {invoice.paymentMethod === "Virement bancaire" && (
            <p><span className="font-medium">IBAN :</span> {invoice.iban || "—"}</p>
          )}
        </div>
      </div>

      {/* MENTIONS LÉGALES OBLIGATOIRES — texte fixe, non modifiable */}
      <div className="space-y-3 text-xs text-gray-500 border-t pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          2. Mentions légales obligatoires (Art. L441-10 du Code de Commerce)
        </p>
        <p>
          <span className="font-semibold text-gray-600">Pénalités de retard : </span>
          En cas de retard de paiement, des pénalités de retard seront appliquées au taux de 3 fois
          le taux d'intérêt légal en vigueur (taux légal × 3), exigibles dès le lendemain de la date
          d'échéance, sans qu'un rappel soit nécessaire.
        </p>
        <p>
          <span className="font-semibold text-gray-600">Indemnité forfaitaire pour frais de recouvrement : </span>
          Conformément à l'article D441-5 du Code de Commerce, une indemnité forfaitaire de 40 € sera
          due de plein droit en cas de retard de paiement. Une indemnité complémentaire pourra être
          réclamée, sur justificatifs, lorsque les frais de recouvrement exposés sont supérieurs à
          ce montant forfaitaire.
        </p>
        <p>
          <span className="font-semibold text-gray-600">Escompte pour paiement anticipé : </span>
          Aucun escompte n'est accordé pour paiement anticipé.
        </p>
      </div>

    </div>
  )
}
