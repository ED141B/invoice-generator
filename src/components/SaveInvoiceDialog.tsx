import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Invoice } from "@/types/invoice"

interface Props {
  invoice: Invoice
  onSave: (title: string) => void
  onClose: () => void
}

function defaultTitle(invoice: Invoice): string {
  const client = invoice.client.name || "Sans client"
  const date = invoice.date
    ? new Date(invoice.date + "T00:00:00").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : ""
  return date ? `${client} — ${date}` : client
}

export function SaveInvoiceDialog({ invoice, onSave, onClose }: Props) {
  const [title, setTitle] = useState(() => defaultTitle(invoice))

  function handleSave() {
    const trimmed = title.trim()
    if (!trimmed) return
    onSave(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-background border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Sauvegarder la facture</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="-mr-1">
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invoice-title">Titre</Label>
          <Input
            id="invoice-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Client Apple — Juillet"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") onClose()
            }}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim()}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  )
}
