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
  SWISS_TAX_RATES_AR,
  AR_BUDGET_POSTS,
  AR_PAYMENT_METHODS,
  computeArItemTTC,
  computeArTotals,
  computeArArchiveDate,
  createEmptyArItem,
  type AssociationReceipt,
  type AssociationReceiptItem,
  type SwissTaxRateAr,
  type ArPaymentMethod,
} from "@/types/associationReceipt"

interface Props {
  receipt: AssociationReceipt
  onChange: (receipt: AssociationReceipt) => void
}

const fmtCHF = new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF" })

export function AssociationReceiptForm({ receipt, onChange }: Props) {
  function set<K extends keyof AssociationReceipt>(key: K, value: AssociationReceipt[K]) {
    onChange({ ...receipt, [key]: value })
  }

  function setAssociation(key: keyof AssociationReceipt["association"], value: string) {
    onChange({ ...receipt, association: { ...receipt.association, [key]: value } })
  }

  function setRequester(key: keyof AssociationReceipt["requester"], value: string) {
    onChange({ ...receipt, requester: { ...receipt.requester, [key]: value } })
  }

  function setItem(id: string, key: keyof Omit<AssociationReceiptItem, "id">, value: string | number) {
    onChange({
      ...receipt,
      items: receipt.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    })
  }

  function addItem() {
    onChange({ ...receipt, items: [...receipt.items, createEmptyArItem()] })
  }

  function removeItem(id: string) {
    onChange({ ...receipt, items: receipt.items.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations du reçu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ar-number">Numéro</Label>
              <Input
                id="ar-number"
                value={receipt.number}
                onChange={(e) => set("number", e.target.value)}
                placeholder="RAS-2025-001"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ar-date">Date</Label>
              <Input
                id="ar-date"
                type="date"
                value={receipt.date}
                onChange={(e) => {
                  const newDate = e.target.value
                  onChange({
                    ...receipt,
                    date: newDate,
                    archiveDate: receipt.archiveDate || computeArArchiveDate(newDate),
                  })
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ar-budget-post">Poste budgétaire *</Label>
            <Select
              value={receipt.budgetPost}
              onValueChange={(v) => set("budgetPost", v)}
            >
              <SelectTrigger id="ar-budget-post">
                <SelectValue placeholder="Sélectionner un poste…" />
              </SelectTrigger>
              <SelectContent>
                {AR_BUDGET_POSTS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ar-associative-reason">Motif associatif * (lien avec l'objet de l'association)</Label>
            <Textarea
              id="ar-associative-reason"
              value={receipt.associativeReason}
              onChange={(e) => set("associativeReason", e.target.value)}
              placeholder="Justifier le lien avec l'objet de l'association (ex : achat de matériel pour l'événement annuel, frais de déplacement AG…)"
              rows={2}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Association + Demandeur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Association</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom de l'association *</Label>
              <Input
                value={receipt.association.name}
                onChange={(e) => setAssociation("name", e.target.value)}
                placeholder="Association XYZ"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Siège social *</Label>
              <Input
                value={receipt.association.address}
                onChange={(e) => setAssociation("address", e.target.value)}
                placeholder="Rue de Rive 1, 1204 Genève"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Numéro de membre / identifiant interne</Label>
              <Input
                value={receipt.association.memberNumber}
                onChange={(e) => setAssociation("memberNumber", e.target.value)}
                placeholder="M-2025-042"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="ar-vat-exempt"
                checked={receipt.vatExempt}
                onChange={(e) => set("vatExempt", e.target.checked)}
                className="size-4 cursor-pointer"
              />
              <Label htmlFor="ar-vat-exempt" className="cursor-pointer">Exonéré de TVA (art. 10 LTVA)</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={receipt.association.email}
                onChange={(e) => setAssociation("email", e.target.value)}
                placeholder="contact@association.ch"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input
                value={receipt.association.phone}
                onChange={(e) => setAssociation("phone", e.target.value)}
                placeholder="+41 22 000 00 00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demandeur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom complet *</Label>
              <Input
                value={receipt.requester.name}
                onChange={(e) => setRequester("name", e.target.value)}
                placeholder="Jean Dupont"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fonction / Rôle *</Label>
              <Input
                value={receipt.requester.role}
                onChange={(e) => setRequester("role", e.target.value)}
                placeholder="Trésorier, Membre du comité…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Validé par (trésorier / responsable) *</Label>
              <Input
                value={receipt.validatedBy}
                onChange={(e) => set("validatedBy", e.target.value)}
                placeholder="Nom du responsable qui approuve"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Signature du demandeur</Label>
              <Input
                value={receipt.requester.signature}
                onChange={(e) => setRequester("signature", e.target.value)}
                placeholder="Jean Dupont, le 26.05.2025"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dépenses remboursables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {receipt.items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Dépense {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {fmtCHF.format(computeArItemTTC(item.amountHT, item.taxRate))}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={receipt.items.length === 1}
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
                  <Label className="text-xs">Moyen de paiement</Label>
                  <Select
                    value={item.paymentMethod}
                    onValueChange={(v) => setItem(item.id, "paymentMethod", v as ArPaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AR_PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
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
                  placeholder="Ex : Achat de matériel pour l'événement"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    onValueChange={(v) => setItem(item.id, "taxRate", parseFloat(v) as SwissTaxRateAr)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SWISS_TAX_RATES_AR.map((r) => (
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
                    value={fmtCHF.format(computeArItemTTC(item.amountHT, item.taxRate))}
                    readOnly
                    className="bg-muted text-muted-foreground cursor-default"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Référence justificatif</Label>
                <Input
                  value={item.receiptRef}
                  onChange={(e) => setItem(item.id, "receiptRef", e.target.value)}
                  placeholder="N° reçu, facture jointe…"
                />
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4 mr-1" />
            Ajouter une dépense
          </Button>

          <Separator />

          {(() => {
            const { totalHT, totalTVA, totalTTC } = computeArTotals(receipt.items)
            return (
              <div className="flex justify-end">
                <div className="space-y-1 text-sm w-64">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total HT</span>
                    <span>{fmtCHF.format(totalHT)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total TVA</span>
                    <span>{fmtCHF.format(totalTVA)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-1">
                    <span>Total TTC</span>
                    <span>{fmtCHF.format(totalTTC)}</span>
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
            value={receipt.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Informations complémentaires, remarques..."
            rows={3}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
