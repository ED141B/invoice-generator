import { useState, useRef, useEffect } from "react"
import { Copy, FolderOpen, Trash2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { computeTotals } from "@/types/invoice"
import { formatDate } from "@/lib/utils"
import type { SavedInvoice } from "@/types/savedInvoice"

const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })
const DELETE_ANIMATION_MS = 300

interface Props {
  saved: SavedInvoice
  onDuplicate: (id: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

export function SavedInvoiceCard({ saved, onDuplicate, onLoad, onDelete, onRename }: Props) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(saved.title)
  const [prevTitle, setPrevTitle] = useState(saved.title)
  const [removing, setRemoving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { total } = computeTotals(saved.invoice.items, saved.invoice.taxRate)

  if (prevTitle !== saved.title) {
    setPrevTitle(saved.title)
    setTitleValue(saved.title)
  }

  useEffect(() => {
    if (editingTitle) inputRef.current?.select()
  }, [editingTitle])

  function commitRename() {
    const trimmed = titleValue.trim()
    if (trimmed && trimmed !== saved.title) {
      onRename(saved.id, trimmed)
    } else {
      setTitleValue(saved.title)
    }
    setEditingTitle(false)
  }

  function handleDelete() {
    setRemoving(true)
    setTimeout(() => onDelete(saved.id), DELETE_ANIMATION_MS)
  }

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-md ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >
      <CardContent className="p-5 space-y-3">
        {editingTitle ? (
          <Input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename()
              if (e.key === "Escape") {
                setTitleValue(saved.title)
                setEditingTitle(false)
              }
            }}
            className="text-lg font-bold h-8 px-1 border-0 border-b rounded-none focus-visible:ring-0"
          />
        ) : (
          <h3
            className="text-lg font-bold leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2"
            onClick={() => setEditingTitle(true)}
            title="Cliquer pour renommer"
          >
            {saved.title}
          </h3>
        )}

        <div className="space-y-0.5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground truncate">
            {saved.invoice.client.name || "—"}
          </p>
          <p>{formatDate(saved.invoice.date)}</p>
          <p className="text-base font-semibold text-foreground pt-0.5">{fmt.format(total)}</p>
        </div>

        {saved.usageCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="size-3" />
            <span>
              Utilisé {saved.usageCount} fois
            </span>
          </div>
        )}

        <div className="flex gap-1.5 pt-1">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onLoad(saved.id)}>
            <FolderOpen className="size-3.5 mr-1.5" />
            Charger
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onDuplicate(saved.id)}>
            <Copy className="size-3.5 mr-1.5" />
            Dupliquer
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
