import { FileText } from "lucide-react"
import { SavedInvoiceCard } from "@/components/SavedInvoiceCard"
import type { SavedInvoice } from "@/types/savedInvoice"

interface Props {
  savedInvoices: SavedInvoice[]
  onDuplicate: (id: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

export function SavedInvoicesPanel({ savedInvoices, onDuplicate, onLoad, onDelete, onRename }: Props) {
  if (savedInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-muted-foreground">
        <FileText className="size-10 opacity-30" />
        <p className="text-sm">Aucune facture sauvegardée</p>
        <p className="text-xs opacity-70">
          Utilisez le bouton "Sauvegarder" sur une facture pour l'ajouter ici
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {savedInvoices.map((saved) => (
        <SavedInvoiceCard
          key={saved.id}
          saved={saved}
          onDuplicate={onDuplicate}
          onLoad={onLoad}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  )
}
