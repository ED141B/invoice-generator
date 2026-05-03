import { useState, useRef, useEffect } from "react"
import { ScrollText, Eye, EyeOff, Printer, ArrowLeft, Bookmark, Library, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReceiptForm } from "@/components/ReceiptForm"
import { ReceiptPreview } from "@/components/ReceiptPreview"
import { SaveReceiptDialog } from "@/components/SaveReceiptDialog"
import { SavedReceiptsPanel } from "@/components/SavedReceiptsPanel"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import type { Receipt } from "@/types/receipt"
import type { SavedReceipt } from "@/types/savedReceipt"

interface Props {
  receipt: Receipt
  onChange: (receipt: Receipt) => void
  onBack: () => void
  savedReceipts: SavedReceipt[]
  onSave: (title: string) => void
  onLoad: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onReset: () => void
}

export function ReceiptEditor({
  receipt,
  onChange,
  onBack,
  savedReceipts,
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
  const receiptRef = useRef<Receipt>(receipt)
  useEffect(() => { receiptRef.current = receipt }, [receipt])

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
              <ScrollText className="size-5 text-primary" />
              <span className="font-semibold text-sm">Reçu</span>
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
              {savedReceipts.length > 0 && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 leading-none font-medium ${showReusePanel ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {savedReceipts.length}
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
              Réutiliser un reçu
            </h2>
            <SavedReceiptsPanel
              savedReceipts={savedReceipts}
              onDuplicate={onDuplicate}
              onLoad={onLoad}
              onDelete={onDelete}
              onRename={onRename}
            />
          </div>
        ) : showPreview ? (
          <div className="max-w-3xl mx-auto">
            <ReceiptPreview receipt={receipt} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Édition</h2>
              <ReceiptForm receipt={receipt} onChange={onChange} />
            </div>
            <div className="xl:sticky xl:top-22">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Aperçu en temps réel</h2>
              <ReceiptPreview receipt={receipt} />
            </div>
          </div>
        )}
      </main>

      {showSaveDialog && (
        <SaveReceiptDialog
          receipt={receipt}
          onSave={onSave}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {showResetConfirm && (
        <ConfirmDialog
          title="Réinitialiser le reçu"
          message="Êtes-vous sûr ? Les modifications non sauvegardées seront perdues. Les reçus déjà sauvegardés dans l'historique ne seront pas affectés."
          confirmLabel="Oui, réinitialiser"
          onConfirm={handleConfirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  )
}
