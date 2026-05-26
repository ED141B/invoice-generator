import { HeartHandshake } from "lucide-react"
import { SavedAssociationReceiptCard } from "@/components/SavedAssociationReceiptCard"
import type { SavedAssociationReceipt } from "@/types/savedAssociationReceipt"

interface Props {
  savedAssociationReceipts: SavedAssociationReceipt[]
  onDuplicate: (id: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

export function SavedAssociationReceiptsPanel({ savedAssociationReceipts, onDuplicate, onLoad, onDelete, onRename }: Props) {
  if (savedAssociationReceipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-muted-foreground">
        <HeartHandshake className="size-10 opacity-30" />
        <p className="text-sm">Aucun reçu association sauvegardé</p>
        <p className="text-xs opacity-70">
          Utilisez le bouton "Sauvegarder" sur un reçu pour l'ajouter ici
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {savedAssociationReceipts.map((saved) => (
        <SavedAssociationReceiptCard
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
