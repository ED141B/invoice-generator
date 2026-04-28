import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { createEmptyItem, type Invoice, type InvoiceItem } from "@/types/invoice"

interface Props {
  invoice: Invoice
  onChange: (invoice: Invoice) => void
}

export function InvoiceForm({ invoice, onChange }: Props) {
  function set<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    onChange({ ...invoice, [key]: value })
  }

  function setSender(key: keyof Invoice["sender"], value: string) {
    onChange({ ...invoice, sender: { ...invoice.sender, [key]: value } })
  }

  function setClient(key: keyof Invoice["client"], value: string) {
    onChange({ ...invoice, client: { ...invoice.client, [key]: value } })
  }

  function setItem(id: string, key: Exclude<keyof InvoiceItem, "id">, value: string | number) {
    onChange({
      ...invoice,
      items: invoice.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    })
  }

  function addItem() {
    onChange({ ...invoice, items: [...invoice.items, createEmptyItem()] })
  }

  function removeItem(id: string) {
    onChange({ ...invoice, items: invoice.items.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      {/* Infos facture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de la facture</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="number">Numéro</Label>
            <Input
              id="number"
              value={invoice.number}
              onChange={(e) => set("number", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Date d'émission</Label>
            <Input
              id="date"
              type="date"
              value={invoice.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
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
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input value={invoice.sender.name} onChange={(e) => setSender("name", e.target.value)} placeholder="Votre nom ou société" />
            </div>
            <div className="space-y-1.5">
              <Label>Adresse</Label>
              <Input value={invoice.sender.address} onChange={(e) => setSender("address", e.target.value)} placeholder="1 rue de la Paix, Paris" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={invoice.sender.email} onChange={(e) => setSender("email", e.target.value)} placeholder="contact@societe.fr" />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={invoice.sender.phone} onChange={(e) => setSender("phone", e.target.value)} placeholder="+33 6 00 00 00 00" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nom</Label>
              <Input value={invoice.client.name} onChange={(e) => setClient("name", e.target.value)} placeholder="Nom du client ou société" />
            </div>
            <div className="space-y-1.5">
              <Label>Adresse</Label>
              <Input value={invoice.client.address} onChange={(e) => setClient("address", e.target.value)} placeholder="10 avenue Victor Hugo, Lyon" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={invoice.client.email} onChange={(e) => setClient("email", e.target.value)} placeholder="client@example.fr" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lignes de prestation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prestations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="hidden sm:grid grid-cols-[1fr_80px_110px_32px] gap-2 text-xs text-muted-foreground px-1">
            <span>Description</span>
            <span>Qté</span>
            <span>Prix unitaire (€)</span>
            <span />
          </div>

          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_80px_110px_32px] gap-2 items-center">
              <Input
                value={item.description}
                onChange={(e) => setItem(item.id, "description", e.target.value)}
                placeholder="Description de la prestation"
              />
              <Input
                type="number"
                min={0}
                value={item.quantity}
                onChange={(e) => setItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
              />
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(e) => setItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                disabled={invoice.items.length === 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addItem} className="mt-1">
            <Plus className="size-4 mr-1" />
            Ajouter une ligne
          </Button>

          <Separator />

          <div className="flex items-center gap-3 justify-end">
            <Label htmlFor="taxRate" className="text-sm text-muted-foreground">TVA (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min={0}
              max={100}
              value={invoice.taxRate}
              onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)}
              className="w-20 text-right"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={invoice.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Conditions de paiement, mentions légales, message au client…"
            rows={3}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
