import { Separator } from "@/components/ui/separator"
import { computeReceiptTotals, type Receipt } from "@/types/receipt"
import { formatDate } from "@/lib/utils"

interface Props {
  receipt: Receipt
}

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export function ReceiptPreview({ receipt }: Props) {
  const { tax, total } = computeReceiptTotals(receipt.amountHT, receipt.taxRate)
  const remaining = Math.round((total - receipt.amountReceived) * 100) / 100

  return (
    <div className="bg-white text-gray-900 rounded-xl border shadow-sm p-4 sm:p-8 space-y-8 print:shadow-none print:rounded-none print:border-none">

      {/* En-tête */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">REÇU</h1>
          <p className="text-sm text-gray-500 mt-1">N° {receipt.number || "—"}</p>
        </div>
        <div className="text-right text-sm">
          <p><span className="text-gray-500">Date d'émission :</span> {formatDate(receipt.date)}</p>
        </div>
      </div>

      <Separator />

      {/* Émetteur + Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Émetteur</p>
          <p className="font-semibold">{receipt.sender.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{receipt.sender.address}</p>
          {receipt.sender.siret && <p className="text-gray-600">SIRET : {receipt.sender.siret}</p>}
          {receipt.sender.vatNumber && <p className="text-gray-600">N° TVA : {receipt.sender.vatNumber}</p>}
          {receipt.sender.email && <p className="text-gray-600">{receipt.sender.email}</p>}
          {receipt.sender.phone && <p className="text-gray-600">{receipt.sender.phone}</p>}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Client</p>
          <p className="font-semibold">{receipt.client.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{receipt.client.address}</p>
        </div>
      </div>

      <Separator />

      {/* Détail */}
      <div className="space-y-2 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Désignation</p>
        <p className="text-gray-700 whitespace-pre-line">
          {receipt.description
            ? receipt.description
            : <span className="text-gray-300 italic">Sans description</span>}
        </p>
      </div>

      {/* Montants */}
      <div className="flex justify-end">
        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Montant HT</span>
            <span>{fmt.format(receipt.amountHT)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA ({receipt.taxRate} %)</span>
            <span>{fmt.format(tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total TTC</span>
            <span>{fmt.format(total)}</span>
          </div>
          <div className="flex justify-between font-semibold text-green-700 pt-1 border-t border-gray-100">
            <span>Montant reçu</span>
            <span>{fmt.format(receipt.amountReceived)}</span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between font-medium text-orange-600">
              <span>Solde restant dû</span>
              <span>{fmt.format(remaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Paiement */}
      <div className="space-y-1 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Règlement</p>
        <p className="text-gray-700">
          <span className="font-medium">Mode :</span> {receipt.paymentMethod}
        </p>
        {receipt.paymentReference && (
          <p className="text-gray-700">
            <span className="font-medium">Référence :</span> {receipt.paymentReference}
          </p>
        )}
      </div>

      {/* Signature */}
      {receipt.signature && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Signature / Tampon</p>
            <p className="text-gray-700 whitespace-pre-line">{receipt.signature}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Pied de page légal */}
      <div className="space-y-3 text-xs text-gray-500">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Mentions légales</p>
        <p>
          Reçu établi le {formatDate(receipt.date)} pour le paiement de la somme de{" "}
          <span className="font-semibold text-gray-700">{fmt.format(receipt.amountReceived)}</span>
          {receipt.description ? ` pour : ${receipt.description}` : ""}.
        </p>
        {remaining > 0 && (
          <>
            <p>
              <span className="font-semibold text-gray-600">Solde restant dû : {fmt.format(remaining)}. </span>
              En cas de retard de paiement du solde, des pénalités de retard seront appliquées au taux de
              3 fois le taux d'intérêt légal en vigueur, exigibles dès le lendemain de la date d'échéance,
              sans qu'un rappel soit nécessaire.
            </p>
            <p>
              <span className="font-semibold text-gray-600">Indemnité forfaitaire de recouvrement : </span>
              Conformément à l'article D441-5 du Code de Commerce, une indemnité forfaitaire de 40 €
              sera due de plein droit en cas de retard de paiement du solde restant dû.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
