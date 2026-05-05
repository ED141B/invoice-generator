import { useState, useRef, useEffect } from "react"
import { Receipt, Eye, EyeOff, Printer, ArrowLeft, Bookmark, Library, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpenseForm } from "@/components/ExpenseForm"
import { ExpensePreview } from "@/components/ExpensePreview"
import { SaveExpenseDialog } from "@/components/SaveExpenseDialog"
import { SavedExpensesPanel } from "@/components/SavedExpensesPanel"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import type { ExpenseReport } from "@/types/expense"
import type { SavedExpense } from "@/types/savedExpense"

interface Props {
  expense: ExpenseReport
  onChange: (expense: ExpenseReport) => void
  onBack: () => void
  savedExpenses: SavedExpense[]
  onSave: (title: string) => void
  onLoad: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onReset: () => void
}

export function ExpenseEditor({
  expense,
  onChange,
  onBack,
  savedExpenses,
  onSave,
  onLoad,
  onDuplicate,
  onDelete,
  onRename,
  onReset,
}: Props) {
  const [showPreview, setShowPreview] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showReusePanel, setShowReusePanel] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const expenseRef = useRef<ExpenseReport>(expense)
  useEffect(() => { expenseRef.current = expense }, [expense])

  function handleConfirmReset() {
    onReset()
    setShowResetConfirm(false)
    setShowPreview(false)
    setShowReusePanel(false)
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Retour" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              <span className="font-semibold text-sm">Note de Frais — CHF</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showReusePanel ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowReusePanel(!showReusePanel)
                setShowPreview(false)
              }}
            >
              <Library className="size-4 mr-1.5" />
              Réutiliser
              {savedExpenses.length > 0 && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 leading-none font-medium ${showReusePanel ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {savedExpenses.length}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
            >
              <Bookmark className="size-4 mr-1.5" />
              Sauvegarder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-4 mr-1.5" />
              Réinitialiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPreview(!showPreview)
                setShowReusePanel(false)
              }}
            >
              {showPreview ? <EyeOff className="size-4 mr-1.5" /> : <Eye className="size-4 mr-1.5" />}
              {showPreview ? "Masquer" : "Aperçu"}
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4 mr-1.5" />
              Imprimer
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showReusePanel ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Réutiliser une note de frais
            </h2>
            <SavedExpensesPanel
              savedExpenses={savedExpenses}
              onDuplicate={onDuplicate}
              onLoad={onLoad}
              onDelete={onDelete}
              onRename={onRename}
            />
          </div>
        ) : showPreview ? (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
            <ExpensePreview expense={expense} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Édition</h2>
              <ExpenseForm expense={expense} onChange={onChange} />
            </div>
            <div className="xl:sticky xl:top-22">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Aperçu en temps réel</h2>
              <ExpensePreview expense={expense} />
            </div>
          </div>
        )}
      </main>

      {showSaveDialog && (
        <SaveExpenseDialog
          expense={expense}
          onSave={onSave}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {showResetConfirm && (
        <ConfirmDialog
          title="Réinitialiser la note de frais"
          message="Êtes-vous sûr ? Les modifications non sauvegardées seront perdues. Les notes déjà sauvegardées dans l'historique ne seront pas affectées."
          confirmLabel="Oui, réinitialiser"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  )
}
