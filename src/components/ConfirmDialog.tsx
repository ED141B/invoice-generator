import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-background border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-base font-semibold">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="-mr-1 -mt-1 shrink-0">
            <X className="size-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>

        <div className="flex gap-2 justify-end pt-1">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
