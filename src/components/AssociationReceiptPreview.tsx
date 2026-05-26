import { Separator } from "@/components/ui/separator"
import { computeArTotals, computeArItemTTC, computeArArchiveDate, type AssociationReceipt } from "@/types/associationReceipt"
import { formatDate } from "@/lib/utils"

interface Props {
  receipt: AssociationReceipt
}

const fmt = new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" })

export function AssociationReceiptPreview({ receipt }: Props) {
  const { totalHT, totalTVA, totalTTC } = computeArTotals(receipt.items)
  const archiveDate = receipt.archiveDate || computeArArchiveDate(receipt.date)

  return (
    <div className="bg-white text-gray-900 rounded-xl border shadow-sm p-8 space-y-8 print:shadow-none print:rounded-none print:border-none">

      {/* En-tête */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">REÇU ASSOCIATION</h1>
          <p className="text-sm text-gray-500 mt-1">N° {receipt.number || "—"}</p>
          {receipt.budgetPost && (
            <p className="text-sm text-gray-600 mt-0.5">
              <span className="font-medium">Poste budgétaire :</span> {receipt.budgetPost}
            </p>
          )}
          {receipt.association.memberNumber && (
            <p className="text-sm text-gray-600 mt-0.5">
              <span className="font-medium">N° membre :</span> {receipt.association.memberNumber}
            </p>
          )}
        </div>
        <div className="text-right text-sm space-y-0.5">
          <p>
            <span className="text-gray-500">Date :</span>{" "}
            {formatDate(receipt.date)}
          </p>
          <p className="text-xs text-gray-400">
            Archivage jusqu'au : {formatDate(archiveDate)}
          </p>
        </div>
      </div>

      <Separator />

      {/* Association + Demandeur */}
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Association</p>
          <p className="font-semibold">{receipt.association.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{receipt.association.address}</p>
          {receipt.vatExempt ? (
            <p className="text-gray-600 text-xs mt-1">Exonéré de TVA (art. 10 LTVA)</p>
          ) : null}
          {receipt.association.email && <p className="text-gray-600">{receipt.association.email}</p>}
          {receipt.association.phone && <p className="text-gray-600">{receipt.association.phone}</p>}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Demandeur</p>
          <p className="font-semibold">{receipt.requester.name || "—"}</p>
          {receipt.requester.role && <p className="text-gray-600">{receipt.requester.role}</p>}
        </div>
      </div>

      {/* Motif associatif */}
      {receipt.associativeReason && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Motif associatif</p>
            <p className="text-gray-700 whitespace-pre-line">{receipt.associativeReason}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Tableau des dépenses */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Détail des dépenses</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Date</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Description</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Paiement</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs text-right">HT</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs text-right">TVA</th>
              <th className="pb-2 text-gray-500 font-medium text-xs text-right">TTC</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => {
              const ttc = computeArItemTTC(item.amountHT, item.taxRate)
              const tva = Math.round((ttc - item.amountHT) * 100) / 100
              return (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-2 text-gray-600 whitespace-nowrap">{formatDate(item.date)}</td>
                  <td className="py-2 pr-2 text-gray-700">
                    {item.description || <span className="text-gray-300 italic">—</span>}
                    {item.receiptRef && (
                      <span className="block text-xs text-gray-400">Réf. : {item.receiptRef}</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-xs text-gray-600 whitespace-nowrap">{item.paymentMethod}</td>
                  <td className="py-2 pr-2 text-right text-gray-600 whitespace-nowrap">{fmt.format(item.amountHT)}</td>
                  <td className="py-2 pr-2 text-right text-gray-500 whitespace-nowrap text-xs">
                    {receipt.vatExempt ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <>{item.taxRate}%<br />{fmt.format(tva)}</>
                    )}
                  </td>
                  <td className="py-2 text-right font-medium whitespace-nowrap">{fmt.format(ttc)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end">
        <div className="w-72 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Total HT</span>
            <span>{fmt.format(totalHT)}</span>
          </div>
          {receipt.vatExempt ? (
            <div className="flex justify-between text-gray-500 text-xs italic">
              <span>TVA</span>
              <span>Exonéré (art. 10 LTVA)</span>
            </div>
          ) : (
            <div className="flex justify-between text-gray-600">
              <span>Total TVA</span>
              <span>{fmt.format(totalTVA)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total {receipt.vatExempt ? "HT" : "TTC"} (CHF)</span>
            <span>{fmt.format(receipt.vatExempt ? totalHT : totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {receipt.notes && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes / Observations</p>
            <p className="text-gray-700 whitespace-pre-line">{receipt.notes}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Signature */}
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Signature du demandeur</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">
            {receipt.requester.signature || receipt.requester.name || "Nom, date"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Validé par</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">{receipt.validatedBy || "Trésorier / Responsable"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tampon association</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">{receipt.association.name || "—"}</p>
        </div>
      </div>

      <Separator />

      {/* Mentions légales CC art. 60-79 */}
      <div className="space-y-2 text-xs text-gray-500">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Mentions légales — Association à but non lucratif — Suisse</p>
        <p>
          Reçu de remboursement de frais établi conformément aux{" "}
          <span className="font-medium text-gray-600">articles 60 à 79 du Code Civil suisse (CC)</span>{" "}
          régissant les associations à but non lucratif.
          Association : <span className="font-medium text-gray-600">{receipt.association.name || "—"}</span>{" "}
          — Siège social : <span className="font-medium text-gray-600">{receipt.association.address || "—"}</span>.
        </p>
        <p>
          {receipt.vatExempt
            ? "L'association est exonérée de la TVA conformément à l'art. 10 LTVA. Aucun montant de TVA n'est récupérable."
            : "Les taux de TVA appliqués sont conformes à la LTVA en vigueur : taux normal 8,1 % · hébergement 3,8 % · taux réduit 2,6 %."}
        </p>
        <p>
          Les justificatifs originaux doivent être conservés pendant{" "}
          <span className="font-medium text-gray-600">10 ans</span> (art. 958f CO).
          Date limite d'archivage : <span className="font-medium text-gray-600">{formatDate(archiveDate)}</span>.
        </p>
        <p>
          Je soussigné(e), <span className="font-medium text-gray-600">{receipt.requester.name || "___"}</span>,
          atteste que les frais ci-dessus ont été engagés dans le cadre de l'activité associative
          {receipt.associativeReason ? ` : ${receipt.associativeReason}` : ""}{" "}
          et que les justificatifs correspondants sont joints ou archivés.
        </p>
      </div>
    </div>
  )
}
