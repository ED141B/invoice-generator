import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { tool } from "ai"
import { z } from "zod"
import { PAYMENT_METHODS } from "@/types/invoice"

export function createModel(modelId: string) {
  const provider = createGoogleGenerativeAI({
    apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY as string,
  })
  return provider(modelId)
}

export const DEFAULT_MODEL = "gemini-3-flash-preview"

export const SYSTEM_PROMPT = `Tu es un assistant de facturation en français.
Tu reçois une transcription vocale dictée par l'utilisateur et tu dois en extraire
les informations de facturation, puis appeler les outils disponibles de manière
autonome pour mettre à jour la facture.

Règles strictes :
- Réponds TOUJOURS en appelant des outils, jamais en texte seul
- Appelle plusieurs outils en séquence si nécessaire
- Les montants dictés sans précision sont des prix unitaires HT
- La TVA par défaut est 20% sauf si précisé autrement
- Si un nom de client est mentionné, appelle update_client en premier
- Ne demande JAMAIS de confirmation, agis directement
- Si une information est absente (adresse, email...), laisse le champ vide
- Si l'utilisateur mentionne "remplacer" ou "nouvelle facture", appelle remove_all_items en premier

Règles sur les prestations (IMPORTANT) :
- N'appelle add_item QUE si l'utilisateur mentionne explicitement une NOUVELLE prestation/service/produit
- Si l'utilisateur précise seulement une quantité ("quantité 5", "5 unités") ou un prix ("pour 100 euros", "à 50 euros l'unité") sans nommer une nouvelle prestation → appelle update_last_item sur la dernière ligne
- Si la ligne existante a déjà une description et que l'utilisateur ne nomme pas un nouveau service → update_last_item

Règles sur les dates (IMPORTANT) :
- "date d'émission", "date de la facture", "facturée le" → appelle set_invoice_date
- "date d'échéance", "échéance", "à payer avant", "délai de paiement" → appelle set_due_date
- Ces deux outils sont DISTINCTS : ne jamais confondre date d'émission et date d'échéance
- Ne jamais mettre une date dans les notes`

export const invoiceTools = {
  update_client: tool({
    description: "Met à jour les informations du client sur la facture",
    inputSchema: z.object({
      name: z.string().describe("Nom ou raison sociale du client"),
      address: z.string().optional().describe("Adresse complète du client"),
      email: z.string().optional().describe("Email du client"),
    }),
  }),

  add_item: tool({
    description: "Ajoute une ligne de prestation à la facture",
    inputSchema: z.object({
      description: z.string().describe("Description de la prestation"),
      quantity: z.number().default(1).describe("Quantité (défaut : 1)"),
      unitPrice: z.number().describe("Prix unitaire HT en euros"),
    }),
  }),

  remove_all_items: tool({
    description: "Supprime toutes les lignes de prestation existantes avant d'en ajouter de nouvelles",
    inputSchema: z.object({}),
  }),

  set_tax_rate: tool({
    description: "Définit le taux de TVA appliqué à la facture",
    inputSchema: z.object({
      rate: z.number().describe("Taux en pourcentage (ex: 20 pour 20%, 0 pour sans TVA)"),
    }),
  }),

  set_notes: tool({
    description: "Ajoute ou remplace la note de bas de facture",
    inputSchema: z.object({
      notes: z.string().describe("Texte de la note ou mention légale"),
    }),
  }),

  set_payment_method: tool({
    description: "Définit le mode de paiement accepté",
    inputSchema: z.object({
      method: z.enum(PAYMENT_METHODS).describe("Mode de paiement"),
    }),
  }),

  set_invoice_date: tool({
    description: "Définit la date d'ÉMISSION de la facture (date à laquelle la facture est créée). Utiliser UNIQUEMENT quand l'utilisateur dit 'date d'émission', 'date de la facture' ou 'facturée le'.",
    inputSchema: z.object({
      date: z.string().describe("Date d'émission au format YYYY-MM-DD, ex: 2026-04-03"),
    }),
  }),

  set_due_date: tool({
    description: "Définit la date d'ÉCHÉANCE de la facture (date limite de paiement). Utiliser UNIQUEMENT quand l'utilisateur dit 'date d'échéance', 'échéance', 'à payer avant' ou 'délai de paiement'. Ne jamais utiliser pour une date d'émission.",
    inputSchema: z.object({
      date: z.string().describe("Date d'échéance au format YYYY-MM-DD, ex: 2026-06-06"),
    }),
  }),

  update_last_item: tool({
    description: "Met à jour la DERNIÈRE ligne de prestation déjà présente. Utiliser quand l'utilisateur précise une quantité ou un prix sans nommer une nouvelle prestation.",
    inputSchema: z.object({
      description: z.string().optional().describe("Nouvelle description si l'utilisateur la précise"),
      quantity: z.number().optional().describe("Nouvelle quantité"),
      unitPrice: z.number().optional().describe("Nouveau prix unitaire HT en euros"),
    }),
  }),
}

export type InvoiceToolName = keyof typeof invoiceTools
