import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SWISS_TAX_RATES,
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  EXPENSE_PAYMENT_TYPES,
  BUDGET_POSTS,
  computeItemTTC,
  computeArchiveDate,
  createEmptyExpenseItem,
  type ExpenseReport,
  type ExpenseItem,
  type SwissTaxRate,
  type ExpenseCategory,
  type ExpensePaymentMethod,
  type ExpensePaymentType,
} from "@/types/expense"

interface Props {
  expense: ExpenseReport
  onChange: (expense: ExpenseReport) => void
}

const fmtCHF = new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" })

export function ExpenseForm({ expense, onChange }: Props) {
  function set<K extends keyof ExpenseReport>(key: K, value: ExpenseReport[K]) {
    onChange({ ...expense, [key]: value })
  }

  function setCompany(key: keyof ExpenseReport["company"], value: string) {
    onChange({ ...expense, company: { ...expense.company, [key]: value } })
  }

  function setEmployee(key: keyof ExpenseReport["employee"], value: string) {
    onChange({ ...expense, employee: { ...expense.employee, [key]: value } })
  }

  function setItem(id: string, key: keyof Omit<ExpenseItem, "id">, value: string | number) {
    onChange({
      ...expense,
      items: expense.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    })
  }

  function addItem() {
    onChange({ ...expense, items: [...expense.items, createEmptyExpenseItem()] })
  }

  function removeItem(id: string) {
    onChange({ ...expense, items: expense.items.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      {/* Infos de la note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de la note de frais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ndf-number">Numéro (AFC)</Label>
              <Input
                id="ndf-number"
                value={expense.number}
                onChange={(e) => set("number", e.target.value)}
                placeholder="NDF-2025-001"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ndf-start">Période — du</Label>
              <Input
                id="ndf-start"
                type="date"
                value={expense.periodStart}
                onChange={(e) => set("periodStart", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ndf-end">au</Label>
              <Input
                id="ndf-end"
                type="date"
                value={expense.periodEnd}
                onChange={(e) => {
                  const newEnd = e.target.value
                  onChange({
                    ...expense,
                    periodEnd: newEnd,
                    archiveDate: expense.archiveDate || computeArchiveDate(newEnd),
                  })
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ndf-budget-post">Poste budgétaire *</Label>
            <Select
              value={expense.budgetPost}
              onValueChange={(v) => set("budgetPost", v)}
            >
              <SelectTrigger id="ndf-budget-post">
                <SelectValue placeholder="Sélectionner un poste…" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_POSTS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ndf-associative-reason">Motif associatif *</Label>
            <Textarea
              id="ndf-associative-reason"
              value={expense.associativeReason}
              onChange={(e) => set("associativeReason", e.target.value)}
              placeholder="Justifier le lien avec l'objet de l'association (ex : organisation de l'assemblée générale, achat de matériel pour l'événement X…)"
              rows={2}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Association + Membre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Association</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom de l'association *</Label>
              <Input
                value={expense.company.name}
                onChange={(e) => setCompany("name", e.target.value)}
                placeholder="Association XYZ"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Siège social *</Label>
              <Input
                value={expense.company.address}
                onChange={(e) => setCompany("address", e.target.value)}
                placeholder="Rue de Rive 1, 1204 Genève"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="vat-exempt"
                checked={expense.vatExempt}
                onChange={(e) => set("vatExempt", e.target.checked)}
                className="size-4 cursor-pointer"
              />
              <Label htmlFor="vat-exempt" className="cursor-pointer">Exonéré de TVA (art. 10 LTVA)</Label>
            </div>
            {!expense.vatExempt && (
              <div className="space-y-1.5">
                <Label>N° TVA CH</Label>
                <Input
                  value={expense.company.vatNumber}
                  onChange={(e) => setCompany("vatNumber", e.target.value)}
                  placeholder="CHE-123.456.789 MWST"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={expense.company.email}
                onChange={(e) => setCompany("email", e.target.value)}
                placeholder="contact@association.ch"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input
                value={expense.company.phone}
                onChange={(e) => setCompany("phone", e.target.value)}
                placeholder="+41 22 000 00 00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Membre / Collaborateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom complet *</Label>
              <Input
                value={expense.employee.name}
                onChange={(e) => setEmployee("name", e.target.value)}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fonction / Rôle *</Label>
              <Input
                value={expense.employee.role}
                onChange={(e) => setEmployee("role", e.target.value)}
                placeholder="Trésorier, Membre du comité…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>IBAN (remboursement)</Label>
              <Input
                value={expense.employee.iban}
                onChange={(e) => setEmployee("iban", e.target.value)}
                placeholder="CH56 0483 5012 3456 7800 9"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Projet / Référence interne</Label>
              <Input
                value={expense.project}
                onChange={(e) => set("project", e.target.value)}
                placeholder="AG 2025, Événement printemps…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Validé par (trésorier) *</Label>
              <Input
                value={expense.validatedBy}
                onChange={(e) => set("validatedBy", e.target.value)}
                placeholder="Nom du responsable qui approuve"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lignes de dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dépenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expense.items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dépense {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {fmtCHF.format(computeItemTTC(item.amountHT, item.taxRate))}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={expense.items.length === 1}
                    className="size-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Date *</Label>
                  <Input
                    type="date"
                    value={item.date}
                    onChange={(e) => setItem(item.id, "date", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Catégorie *</Label>
                  <Select
                    value={item.category}
                    onValueChange={(v) => setItem(item.id, "category", v as ExpenseCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description *</Label>
                <Input
                  value={item.description}
                  onChange={(e) => setItem(item.id, "description", e.target.value)}
                  placeholder="Ex : Déjeuner de travail avec M. Martin"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Montant HT (CHF) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.amountHT}
                    onChange={(e) => setItem(item.id, "amountHT", parseFloat(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">TVA suisse</Label>
                  <Select
                    value={String(item.taxRate)}
                    onValueChange={(v) => setItem(item.id, "taxRate", parseFloat(v) as SwissTaxRate)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SWISS_TAX_RATES.map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r === 8.1 ? "8.1 % (normal)" : r === 3.8 ? "3.8 % (hébergement)" : r === 2.6 ? "2.6 % (réduit)" : "0 % (exonéré)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">TTC (CHF)</Label>
                  <Input
                    value={fmtCHF.format(computeItemTTC(item.amountHT, item.taxRate))}
                    readOnly
                    className="bg-muted text-muted-foreground cursor-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Moyen de paiement</Label>
                  <Select
                    value={item.paymentMethod}
                    onValueChange={(v) => setItem(item.id, "paymentMethod", v as ExpensePaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Référence justificatif</Label>
                  <Input
                    value={item.receiptRef}
                    onChange={(e) => setItem(item.id, "receiptRef", e.target.value)}
                    placeholder="N° reçu, facture jointe…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mode de remboursement *</Label>
                  <Select
                    value={item.paymentType}
                    onValueChange={(v) => setItem(item.id, "paymentType", v as ExpensePaymentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_PAYMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4 mr-1" />
            Ajouter une dépense
          </Button>

          <Separator />

          {/* Totaux */}
          {(() => {
            const totalHT = expense.items.reduce((s, i) => s + i.amountHT, 0)
            const totalTTC = expense.items.reduce((s, i) => s + computeItemTTC(i.amountHT, i.taxRate), 0)
            return (
              <div className="flex justify-end">
                <div className="space-y-1 text-sm w-64">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total HT</span>
                    <span>{fmtCHF.format(Math.round(totalHT * 100) / 100)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total TVA</span>
                    <span>{fmtCHF.format(Math.round((totalTTC - totalHT) * 100) / 100)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-1">
                    <span>Total TTC</span>
                    <span>{fmtCHF.format(Math.round(totalTTC * 100) / 100)}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes / Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={expense.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Informations complémentaires, remarques…"
            rows={3}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
