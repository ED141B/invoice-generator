import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ExpenseReport } from "@/types/expense"

interface Props {
  expense: ExpenseReport
  onSave: (title: string) => void
  onClose: () => void
}

function defaultTitle(expense: ExpenseReport): string {
  const employee = expense.employee.name || "Collaborateur"
  const date = expense.periodStart
    ? new Date(expense.periodStart + "T00:00:00").toLocaleDateString("fr-CH", { month: "long", year: "numeric" })
    : ""
  return date ? `${employee} — ${date}` : employee
}

export function SaveExpenseDialog({ expense, onSave, onClose }: Props) {
  const [title, setTitle] = useState(() => defaultTitle(expense))

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
          <h2 className="text-base font-semibold">Sauvegarder la note de frais</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="-mr-1">
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="expense-title">Titre</Label>
          <Input
            id="expense-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Jean Dupont — Mai 2025"
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
