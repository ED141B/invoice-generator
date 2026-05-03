import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Loader2, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useVoiceAgent, type ChatMessage } from "@/hooks/useVoiceAgent"
import { type Invoice } from "@/types/invoice"

interface Props {
  invoice: Invoice
  onChange: (invoice: Invoice) => void
}

const TOOL_LABELS: Record<string, string> = {
  update_client: "Client mis à jour",
  add_item: "Prestation ajoutée",
  remove_all_items: "Lignes effacées",
  set_tax_rate: "TVA modifiée",
  set_notes: "Note ajoutée",
  set_payment_method: "Paiement modifié",
  set_invoice_date: "Date d'émission mise à jour",
  set_due_date: "Date d'échéance mise à jour",
  update_last_item: "Ligne mise à jour",
}

function ToolBadge({ toolName, input }: { toolName: string; input: Record<string, unknown> }) {
  let detail = ""
  if (toolName === "update_client") detail = ` → ${input.name}`
  else if (toolName === "add_item") detail = ` — ${input.description} (${input.unitPrice} €)`
  else if (toolName === "set_tax_rate") detail = ` → ${input.rate} %`
  else if (toolName === "set_payment_method") detail = ` → ${input.method}`

  return (
    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5 w-fit">
      <span>✅</span>
      <span>{TOOL_LABELS[toolName] ?? toolName}{detail}</span>
    </span>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 bg-primary text-primary-foreground text-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-3 py-2 bg-muted text-muted-foreground text-sm space-y-1.5">
        <p>{message.content}</p>
        {message.toolActions && message.toolActions.length > 0 && (
          <div className="flex flex-col gap-1 pt-0.5">
            {message.toolActions.map((action, i) => (
              <ToolBadge key={i} toolName={action.toolName} input={action.input} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function VoiceChatbot({ invoice, onChange }: Props) {
  const { status, messages, startListening, sendText } = useVoiceAgent({ invoice, onChange })
  const [text, setText] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleSend() {
    if (!text.trim() || status === "processing") return
    sendText(text)
    setText("")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const micDisabled = status === "processing" || status === "listening"

  function handleMicClick() {
    startListening((transcript) => setText(transcript))
  }

  return (
    <div className="flex flex-col w-[35%] min-w-[280px] h-[calc(100vh-56px)] bg-card border-r border-border shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Bot className="size-4 text-primary shrink-0" />
        <span className="font-semibold text-sm">Assistant vocal</span>
        <Badge variant="secondary" className="text-xs ml-auto">
          Gemini
        </Badge>
      </div>

      {/* Message list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center pt-8">
            Dictez votre facture ou posez une question.
          </p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {status === "processing" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm px-3 py-2 bg-muted text-muted-foreground text-sm flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" />
              <span>Analyse en cours...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border px-3 py-3 space-y-2">
        {status === "listening" && (
          <p className="text-xs text-destructive text-center animate-pulse">Je vous écoute...</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMicClick}
            disabled={micDisabled}
            aria-label="Dicter"
            className={cn(
              "shrink-0",
              status === "listening" && "bg-destructive text-destructive-foreground border-destructive animate-pulse",
              status === "success" && "bg-green-100 text-green-800 border-green-300"
            )}
          >
            {status === "processing" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : status === "listening" ? (
              <MicOff className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </Button>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez un message..."
            disabled={status === "processing"}
            className="flex-1 text-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim() || status === "processing"}
            aria-label="Envoyer"
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
