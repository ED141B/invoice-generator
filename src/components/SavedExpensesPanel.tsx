import { Receipt } from "lucide-react"
import { SavedExpenseCard } from "@/components/SavedExpenseCard"
import type { SavedExpense } from "@/types/savedExpense"

interface Props {
  savedExpenses: SavedExpense[]
  onDuplicate: (id: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

export function SavedExpensesPanel({ savedExpenses, onDuplicate, onLoad, onDelete, onRename }: Props) {
  if (savedExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-muted-foreground">
        <Receipt className="size-10 opacity-30" />
        <p className="text-sm">Aucune note de frais sauvegardée</p>
        <p className="text-xs opacity-70">
          Utilisez le bouton "Sauvegarder" sur une note pour l'ajouter ici
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {savedExpenses.map((saved) => (
        <SavedExpenseCard
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
