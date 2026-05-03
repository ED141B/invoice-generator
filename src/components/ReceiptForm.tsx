import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  TAX_RATES,
  RECEIPT_PAYMENT_METHODS,
  computeReceiptTotals,
  type Receipt,
  type ReceiptPaymentMethod,
} from "@/types/receipt"

interface Props {
  receipt: Receipt
  onChange: (receipt: Receipt) => void
}

export function ReceiptForm({ receipt, onChange }: Props) {
  function set<K extends keyof Receipt>(key: K, value: Receipt[K]) {
    onChange({ ...receipt, [key]: value })
  }

  function setSender(key: keyof Receipt["sender"], value: string) {
    onChange({ ...receipt, sender: { ...receipt.sender, [key]: value } })
  }

  function setClient(key: keyof Receipt["client"], value: string) {
    onChange({ ...receipt, client: { ...receipt.client, [key]: value } })
  }

  const { total } = computeReceiptTotals(receipt.amountHT, receipt.taxRate)

  function updateAmountHT(ht: number) {
    const { total: newTotal } = computeReceiptTotals(ht, receipt.taxRate)
    onChange({ ...receipt, amountHT: ht, amountReceived: newTotal })
  }

  function updateTaxRate(rate: number) {
    const { total: newTotal } = computeReceiptTotals(receipt.amountHT, rate)
    onChange({ ...receipt, taxRate: rate, amountReceived: newTotal })
  }

  return (
    <div className="space-y-6">
      {/* Infos reçu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations du reçu</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="rec-number">Numéro</Label>
            <Input
              id="rec-number"
              value={receipt.number}
              onChange={(e) => set("number", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rec-date">Date d'émission</Label>
            <Input
              id="rec-date"
              type="date"
              value={receipt.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Émetteur + Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Votre entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                { key: "name", label: "Nom / Raison sociale", placeholder: "Votre nom ou société" },
                { key: "address", label: "Adresse", placeholder: "1 rue de la Paix, 75001 Paris" },
                { key: "siret", label: "SIRET", placeholder: "123 456 789 00012" },
                { key: "vatNumber", label: "N° TVA intracommunautaire", placeholder: "FR 12 345678901" },
                { key: "email", label: "Email", placeholder: "contact@societe.fr" },
                { key: "phone", label: "Téléphone", placeholder: "+33 6 00 00 00 00" },
              ] as { key: keyof Receipt["sender"]; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  value={receipt.sender[key]}
                  onChange={(e) => setSender(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom / Raison sociale</Label>
              <Input
                value={receipt.client.name}
                onChange={(e) => setClient("name", e.target.value)}
                placeholder="Nom du client ou société"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Adresse</Label>
              <Input
                value={receipt.client.address}
                onChange={(e) => setClient("address", e.target.value)}
                placeholder="10 avenue Victor Hugo, 69000 Lyon"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détail du paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détail du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Description de la prestation / produit</Label>
            <Textarea
              value={receipt.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Prestation de service, produit livré…"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amountHT">Montant HT (€)</Label>
              <Input
                id="amountHT"
                type="number"
                min={0}
                step={0.01}
                value={receipt.amountHT}
                onChange={(e) => updateAmountHT(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taxRate">TVA</Label>
              <Select
                value={String(receipt.taxRate)}
                onValueChange={(v) => updateTaxRate(parseFloat(v))}
              >
                <SelectTrigger id="taxRate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAX_RATES.map((r) => (
                    <SelectItem key={r} value={String(r)}>{r} %</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Montant TTC (€)</Label>
              <Input value={total.toFixed(2)} readOnly className="bg-muted text-muted-foreground cursor-default" />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amountReceived">Montant reçu (€)</Label>
              <Input
                id="amountReceived"
                type="number"
                min={0}
                step={0.01}
                value={receipt.amountReceived}
                onChange={(e) => set("amountReceived", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Peut être inférieur au TTC en cas d'acompte</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod">Mode de paiement</Label>
              <Select
                value={receipt.paymentMethod}
                onValueChange={(v) => set("paymentMethod", v as ReceiptPaymentMethod)}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECEIPT_PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m === "CB" ? "Carte bancaire (CB)" : m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="paymentReference">Référence de paiement (optionnel)</Label>
            <Input
              id="paymentReference"
              value={receipt.paymentReference}
              onChange={(e) => set("paymentReference", e.target.value)}
              placeholder="N° de chèque, référence virement…"
            />
          </div>
        </CardContent>
      </Card>

      {/* Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signature / Tampon (optionnel)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={receipt.signature}
            onChange={(e) => set("signature", e.target.value)}
            placeholder="Nom et qualité du signataire…"
            rows={2}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
