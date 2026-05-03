import { useState, useCallback, useRef, useEffect } from "react"
import { generateText, stepCountIs } from "ai"
import { createModel, DEFAULT_MODEL, SYSTEM_PROMPT, invoiceTools } from "@/config/ai"
import { createEmptyItem, type Invoice } from "@/types/invoice"

export type AgentStatus = "idle" | "listening" | "processing" | "success" | "error"

export interface ToolAction {
  toolName: string
  input: Record<string, unknown>
}

export interface ChatMessage {
  role: "user" | "agent"
  content: string
  toolActions?: ToolAction[]
}

interface UseVoiceAgentProps {
  invoice: Invoice
  onChange: (invoice: Invoice) => void
}

type SpeechRecognitionCtor = new () => {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

const SUCCESS_RESET_DELAY_MS = 1500
const ERROR_RESET_DELAY_MS = 2000

type ToolHandler = (inv: Invoice, input: Record<string, unknown>) => Invoice

export function useVoiceAgent({ invoice, onChange }: UseVoiceAgentProps) {
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const invoiceRef = useRef(invoice)
  useEffect(() => { invoiceRef.current = invoice }, [invoice])

  const applyToolCalls = useCallback(
    (toolCalls: Array<{ toolName: string; input: Record<string, unknown> }>) => {
      const handlers: Record<string, ToolHandler> = {
        "update_client": (inv, input) => ({
          ...inv,
          client: {
            name: (input.name as string) ?? inv.client.name,
            address: (input.address as string) ?? inv.client.address,
            email: (input.email as string) ?? inv.client.email,
          },
        }),
        "add_item": (inv, input) => {
          const item = createEmptyItem()
          item.description = (input.description as string) ?? ""
          item.quantity = typeof input.quantity === "number" ? input.quantity : 1
          item.unitPrice = typeof input.unitPrice === "number" ? input.unitPrice : 0
          const items = inv.items.length === 1 && !inv.items[0].description
            ? [item]
            : [...inv.items, item]
          return { ...inv, items }
        },
        "remove_all_items": (inv) => ({ ...inv, items: [createEmptyItem()] }),
        "set_tax_rate": (inv, input) => ({
          ...inv,
          taxRate: typeof input.rate === "number" ? input.rate : inv.taxRate,
        }),
        "set_notes": (inv, input) => ({
          ...inv,
          notes: (input.notes as string) ?? inv.notes,
        }),
        "set_payment_method": (inv, input) => ({
          ...inv,
          paymentMethod: input.method as Invoice["paymentMethod"],
        }),
        "set_invoice_date": (inv, input) => ({
          ...inv,
          date: (input.date as string) ?? inv.date,
        }),
        "set_due_date": (inv, input) => ({
          ...inv,
          dueDate: (input.date as string) ?? inv.dueDate,
        }),
        "update_last_item": (inv, input) => {
          if (!inv.items.length) return inv
          const lastIndex = inv.items.length - 1
          const lastItem = { ...inv.items[lastIndex] }
          if (typeof input.description === "string") lastItem.description = input.description
          if (typeof input.quantity === "number") lastItem.quantity = input.quantity
          if (typeof input.unitPrice === "number") lastItem.unitPrice = input.unitPrice
          const items = [...inv.items]
          items[lastIndex] = lastItem
          return { ...inv, items }
        },
      }

      let updated = { ...invoiceRef.current }
      for (const call of toolCalls) {
        const handler = handlers[call.toolName]
        if (handler) updated = handler(updated, call.input)
      }
      onChange(updated)
    },
    [onChange]
  )

  const runAgent = useCallback(
    async (transcript: string) => {
      setStatus("processing")
      setMessages((prev) => [...prev, { role: "user", content: transcript }])

      try {
        const result = await generateText({
          model: createModel(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          prompt: transcript,
          tools: invoiceTools,
          stopWhen: stepCountIs(10),
        })

        const toolActions: ToolAction[] = result.toolCalls.map((tc) => ({
          toolName: tc.toolName,
          input: tc.input as Record<string, unknown>,
        }))

        if (toolActions.length > 0) {
          applyToolCalls(toolActions)
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: toolActions.length > 0 ? "Facture mise à jour !" : "Je n'ai pas compris, pouvez-vous reformuler ?",
            toolActions,
          },
        ])

        setStatus("success")
        setTimeout(() => setStatus("idle"), SUCCESS_RESET_DELAY_MS)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: `Erreur: ${msg}` },
        ])
        setStatus("error")
        setTimeout(() => setStatus("idle"), ERROR_RESET_DELAY_MS)
      }
    },
    [applyToolCalls]
  )

  const startListening = useCallback((onTranscript: (text: string) => void) => {
    const win = window as unknown as {
      webkitSpeechRecognition?: SpeechRecognitionCtor
      SpeechRecognition?: SpeechRecognitionCtor
    }
    const Ctor = win.webkitSpeechRecognition ?? win.SpeechRecognition

    if (!Ctor) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "La reconnaissance vocale n'est pas disponible dans ce navigateur." },
      ])
      return
    }

    const recognition = new Ctor()
    recognition.lang = "fr-FR"
    recognition.continuous = false
    recognition.interimResults = false

    setStatus("listening")

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!event.results.length || !event.results[0].length) return
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
    }

    recognition.onerror = () => {
      setStatus("idle")
    }

    recognition.onend = () => {
      setStatus((s) => (s === "listening" ? "idle" : s))
    }

    recognition.start()
  }, [])

  const sendText = useCallback(
    (text: string) => {
      if (!text.trim()) return
      void runAgent(text.trim())
    },
    [runAgent]
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return { status, messages, startListening, sendText, clearMessages }
}
