import { Separator } from "@/components/ui/separator"
import { computeExpenseTotals, computeItemTTC, computeArchiveDate, type ExpenseReport } from "@/types/expense"
import { formatDate } from "@/lib/utils"

interface Props {
  expense: ExpenseReport
}

const fmt = new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" })

export function ExpensePreview({ expense }: Props) {
  const { totalHT, totalTVA, totalTTC } = computeExpenseTotals(expense.items)
  const archiveDate = expense.archiveDate || computeArchiveDate(expense.periodEnd)

  return (
    <div className="bg-white text-gray-900 rounded-xl border shadow-sm p-8 space-y-8 print:shadow-none print:rounded-none print:border-none">

      {/* En-tête */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NOTE DE FRAIS</h1>
          <p className="text-sm text-gray-500 mt-1">N° {expense.number || "—"}</p>
          {expense.budgetPost && (
            <p className="text-sm text-gray-600 mt-0.5">
              <span className="font-medium">Poste budgétaire :</span> {expense.budgetPost}
            </p>
          )}
        </div>
        <div className="text-right text-sm space-y-0.5">
          <p>
            <span className="text-gray-500">Période :</span>{" "}
            {formatDate(expense.periodStart)}{expense.periodEnd !== expense.periodStart ? ` – ${formatDate(expense.periodEnd)}` : ""}
          </p>
          <p className="text-xs text-gray-400">
            Archivage jusqu'au : {formatDate(archiveDate)}
          </p>
        </div>
      </div>

      <Separator />

      {/* Association + Membre */}
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Association</p>
          <p className="font-semibold">{expense.company.name || "—"}</p>
          <p className="text-gray-600 whitespace-pre-line">{expense.company.address}</p>
          {expense.vatExempt ? (
            <p className="text-gray-600 text-xs mt-1">Exonéré de TVA (art. 10 LTVA)</p>
          ) : expense.company.vatNumber ? (
            <p className="text-gray-600">N° TVA : {expense.company.vatNumber}</p>
          ) : null}
          {expense.company.email && <p className="text-gray-600">{expense.company.email}</p>}
          {expense.company.phone && <p className="text-gray-600">{expense.company.phone}</p>}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Membre / Collaborateur</p>
          <p className="font-semibold">{expense.employee.name || "—"}</p>
          {expense.employee.role && <p className="text-gray-600">{expense.employee.role}</p>}
          {expense.project && (
            <p className="text-gray-600 mt-2">
              <span className="font-medium text-gray-700">Référence :</span> {expense.project}
            </p>
          )}
          {expense.employee.iban && (
            <p className="text-gray-600 text-xs mt-2">
              <span className="font-medium">IBAN :</span> {expense.employee.iban}
            </p>
          )}
        </div>
      </div>

      {/* Motif associatif */}
      {expense.associativeReason && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Motif associatif</p>
            <p className="text-gray-700 whitespace-pre-line">{expense.associativeReason}</p>
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
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Catégorie</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Description</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs">Mode remb.</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs text-right">HT</th>
              <th className="pb-2 pr-2 text-gray-500 font-medium text-xs text-right">TVA</th>
              <th className="pb-2 text-gray-500 font-medium text-xs text-right">TTC</th>
            </tr>
          </thead>
          <tbody>
            {expense.items.map((item) => {
              const ttc = computeItemTTC(item.amountHT, item.taxRate)
              const tva = Math.round((ttc - item.amountHT) * 100) / 100
              return (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-2 text-gray-600 whitespace-nowrap">{formatDate(item.date)}</td>
                  <td className="py-2 pr-2 text-gray-600 text-xs">{item.category}</td>
                  <td className="py-2 pr-2 text-gray-700">
                    {item.description || <span className="text-gray-300 italic">—</span>}
                    {item.receiptRef && (
                      <span className="block text-xs text-gray-400">Réf. : {item.receiptRef}</span>
                    )}
                    <span className="block text-xs text-gray-400">{item.paymentMethod}</span>
                  </td>
                  <td className="py-2 pr-2 text-xs whitespace-nowrap">
                    {item.paymentType === "Avancée par un membre" ? (
                      <span className="text-amber-700 font-medium">Avance membre</span>
                    ) : (
                      <span className="text-blue-700 font-medium">Asso.</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-right text-gray-600 whitespace-nowrap">{fmt.format(item.amountHT)}</td>
                  <td className="py-2 pr-2 text-right text-gray-500 whitespace-nowrap text-xs">
                    {expense.vatExempt ? (
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
          {expense.vatExempt ? (
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
            <span>Total {expense.vatExempt ? "HT" : "TTC"} (CHF)</span>
            <span>{fmt.format(expense.vatExempt ? totalHT : totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {expense.notes && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notes / Observations</p>
            {expense.notesHtml ? (
              <p className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: expense.notesHtml }} />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{expense.notes}</p>
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Signature */}
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Signature du membre</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">{expense.employee.name || "Nom, date"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Validé par</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">{expense.validatedBy || "Trésorier / Responsable"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tampon association</p>
          <div className="h-16 border-b border-gray-300 mt-4" />
          <p className="text-xs text-gray-500 mt-1">{expense.company.name || "—"}</p>
        </div>
      </div>

      <Separator />

      {/* Mentions légales CC + AFC */}
      <div className="space-y-2 text-xs text-gray-500">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Mentions légales — Conformité Association Suisse</p>
        <p>
          Note de frais établie conformément aux <span className="font-medium text-gray-600">articles 60 à 79 du Code Civil suisse (CC)</span> régissant
          les associations à but non lucratif, et à l'<span className="font-medium text-gray-600">Administration Fédérale des Contributions (AFC)</span>.
          Association : <span className="font-medium text-gray-600">{expense.company.name || "—"}</span> — Siège social : <span className="font-medium text-gray-600">{expense.company.address || "—"}</span>.
        </p>
        <p>
          {expense.vatExempt
            ? "L'association est exonérée de la TVA conformément à l'art. 10 LTVA. Aucun montant de TVA n'est récupérable."
            : `Les taux de TVA appliqués sont conformes à la LTVA : taux normal 8,1 % · hébergement 3,8 % · taux réduit 2,6 %.${expense.company.vatNumber ? ` Assujetti sous N° ${expense.company.vatNumber}.` : ""}`
          }
        </p>
        <p>
          Les justificatifs originaux doivent être conservés pendant <span className="font-medium text-gray-600">10 ans</span> (art. 958f CO).
          Date limite d'archivage : <span className="font-medium text-gray-600">{formatDate(archiveDate)}</span>.
        </p>
        <p>
          Je soussigné(e), <span className="font-medium text-gray-600">{expense.employee.name || "___"}</span>,
          atteste que les frais ci-dessus ont été engagés dans le cadre de l'activité associative
          {expense.associativeReason ? ` : ${expense.associativeReason}` : ""} et que les justificatifs correspondants sont joints ou archivés.
        </p>
      </div>
    </div>
  )
}
