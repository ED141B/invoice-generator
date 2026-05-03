import { useState } from "react"
import { KeyRound, Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  onSave: (key: string) => void
}

export function ApiKeySetup({ onSave }: Props) {
  const [value, setValue] = useState("")
  const [showKey, setShowKey] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) onSave(value.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <KeyRound className="size-8 text-primary" />
        <h2 className="font-semibold text-sm">Clé API Google Gemini requise</h2>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Entrez votre clé API pour activer l'assistant. Elle sera stockée uniquement dans votre navigateur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="api-key" className="text-xs">Clé API</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="AIza..."
              className="pr-8 text-sm"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showKey ? "Masquer" : "Afficher"}
            >
              {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
        </div>
        <Button type="submit" size="sm" className="w-full" disabled={!value.trim()}>
          Enregistrer
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Obtenez une clé sur{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Google AI Studio
        </a>
      </p>
    </div>
  )
}

interface ResetProps {
  onClear: () => void
}

export function ApiKeyReset({ onClear }: ResetProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      className="text-muted-foreground hover:text-destructive text-xs gap-1"
      title="Supprimer la clé API"
    >
      <Trash2 className="size-3" />
      Clé API
    </Button>
  )
}
