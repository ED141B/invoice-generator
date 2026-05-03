# Agent Vocal — Prompt & Outils

Modèle : **gemini-3-flash-preview** via Vercel AI SDK (`@ai-sdk/google`)

---

## Installation

```bash
npm install ai @ai-sdk/google zod
```

---

## Initialisation du modèle

```ts
import { google } from '@ai-sdk/google'

const model = google('gemini-3-flash-preview')
```

---

## System Prompt

```
Tu es un assistant de facturation en français.
Tu reçois une transcription vocale dictée par l'utilisateur et tu dois en extraire
les informations de facturation, puis appeler les outils disponibles de manière
autonome pour mettre à jour la facture.

Règles strictes :
- Réponds TOUJOURS en appelant des outils, jamais en texte seul
- Appelle plusieurs outils en séquence si nécessaire
- Les montants dictés sans précision sont des prix unitaires HT
- La TVA par défaut est 20% sauf si précisé autrement
- Si un nom de client est mentionné, appelle update_client en premier
- Si des prestations sont mentionnées, appelle add_item pour chacune
- Ne demande JAMAIS de confirmation, agis directement
- Si une information est absente (adresse, email...), laisse le champ vide
- Si l'utilisateur mentionne "remplacer" ou "nouvelle facture", appelle remove_all_items en premier
```

---

## Définition des outils (TypeScript — Vercel AI SDK)

```ts
import { tool } from 'ai'
import { z } from 'zod'

export const invoiceTools = {

  update_client: tool({
    description: 'Met à jour les informations du client sur la facture',
    parameters: z.object({
      name: z.string().describe('Nom ou raison sociale du client'),
      address: z.string().optional().describe('Adresse complète du client'),
      email: z.string().optional().describe('Email du client'),
    }),
  }),

  add_item: tool({
    description: 'Ajoute une ligne de prestation à la facture',
    parameters: z.object({
      description: z.string().describe('Description de la prestation'),
      quantity: z.number().default(1).describe('Quantité (défaut : 1)'),
      unitPrice: z.number().describe('Prix unitaire HT en euros'),
    }),
  }),

  remove_all_items: tool({
    description: "Supprime toutes les lignes de prestation existantes avant d'en ajouter de nouvelles",
    parameters: z.object({}),
  }),

  set_tax_rate: tool({
    description: 'Définit le taux de TVA appliqué à la facture',
    parameters: z.object({
      rate: z.number().describe('Taux en pourcentage (ex: 20 pour 20%, 0 pour sans TVA)'),
    }),
  }),

  set_notes: tool({
    description: 'Ajoute ou remplace la note de bas de facture',
    parameters: z.object({
      notes: z.string().describe('Texte de la note ou mention légale'),
    }),
  }),

  set_payment_method: tool({
    description: 'Définit le mode de paiement accepté',
    parameters: z.object({
      method: z.enum(['Virement bancaire', 'Chèque', 'CB'])
               .describe('Mode de paiement'),
    }),
  }),
}
```

---

## Exemple de flux complet

**Dictée utilisateur :**
> "Le client est Michel SAS et je lui ai facturé une réparation de 4000€
> ainsi que l'entretien pour les deux prochains mois pour 2000€
> avec une TVA de 20%."

**Appels autonomes déclenchés par l'agent :**

| Ordre | Outil | Paramètres |
|-------|-------|------------|
| 1 | `remove_all_items` | `{}` |
| 2 | `update_client` | `{ name: "Michel SAS" }` |
| 3 | `add_item` | `{ description: "Réparation", quantity: 1, unitPrice: 4000 }` |
| 4 | `add_item` | `{ description: "Entretien 2 mois", quantity: 1, unitPrice: 2000 }` |
| 5 | `set_tax_rate` | `{ rate: 20 }` |

---

## Clé API — Google AI Studio (gratuit)

```bash
# Fichier .env à la racine du projet (ne jamais committer sur Git)
VITE_GOOGLE_GENERATIVE_AI_API_KEY=ta_clé_ici
```

Obtenir une clé gratuite : https://aistudio.google.com/apikey

**Limites du free tier Gemini 2.5 Flash :**
- 15 requêtes / minute
- 1 500 requêtes / jour
- Coût : 0 € pour un usage personnel

---

## Appel de l'agent (squelette)

```ts
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { invoiceTools } from './invoiceTools'

const SYSTEM_PROMPT = `...` // le prompt ci-dessus

async function runInvoiceAgent(transcript: string) {
  const { toolCalls } = await generateText({
    model: google('gemini-3-flash-preview'),
    system: SYSTEM_PROMPT,
    prompt: transcript,
    tools: invoiceTools,
    maxSteps: 10, // nombre max d'appels d'outils en séquence
  })

  return toolCalls // liste des outils appelés avec leurs paramètres
}
```

---

## Reconnaissance vocale (Web Speech API — gratuit, natif Chrome/Edge)

```ts
const recognition = new window.webkitSpeechRecognition()
recognition.lang = 'fr-FR'
recognition.interimResults = false

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  runInvoiceAgent(transcript) // envoi direct à l'agent
}

recognition.start()
```

---

## Fichiers à créer pour l'implémentation

| Fichier | Rôle |
|---------|------|
| `src/config/ai.ts` | Modèle Gemini + system prompt |
| `src/hooks/useVoiceAgent.ts` | Micro + appel agent + mise à jour invoice |
| `src/components/VoiceChatbot.tsx` | Panneau chat gauche complet |

L'intégration dans `App.tsx` : passer `invoice` et `setInvoice` au composant `VoiceChatbot`.

---

## UI/UX — Design du panneau chat

### Layout général (desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (boutons Save / Reset / Print…)                         │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                          │
│   PANNEAU CHAT       │       APERÇU FACTURE (live)              │
│   (gauche, fixe)     │       (droite, scrollable)               │
│                      │                                          │
│   ~35% largeur       │       ~65% largeur                       │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

**Classe Tailwind pour le layout de l'éditeur :**
```tsx
// Layout parent dans App.tsx ou InvoiceEditor
<div className="flex h-[calc(100vh-64px)] gap-0">
  <VoiceChatbot invoice={invoice} onChange={setInvoice} />  {/* 35% */}
  <InvoicePreview invoice={invoice} />                       {/* 65% */}
</div>
```

**Responsive :**
- Desktop (≥1024px) : chat à gauche + aperçu à droite côte à côte
- Tablette/Mobile (<1024px) : chat en drawer ou onglet en bas, aperçu plein écran

---

### Structure du panneau chat (VoiceChatbot.tsx)

```
┌─────────────────────────┐
│  Titre + indicateur     │  ← "Assistant vocal" + badge modèle
│  modèle actif           │
├─────────────────────────┤
│                         │
│   Fil de messages       │  ← scroll automatique vers le bas
│   (flex-col, gap-3)     │
│                         │
│  [Msg utilisateur]      │  ← bulle droite, bg-primary
│  [Msg agent]            │  ← bulle gauche, bg-muted
│  [Actions en cours]     │  ← badges animés par outil appelé
│                         │
├─────────────────────────┤
│  Zone saisie / micro    │  ← fixée en bas du panneau
│  [🎤 Dicter] [Envoyer]  │
└─────────────────────────┘
```

---

### États visuels du bouton micro

| État | Apparence | Description |
|------|-----------|-------------|
| Inactif | Bouton gris, icône `Mic` | Prêt à écouter |
| Écoute | Bouton rouge pulsant, icône `MicOff` | Enregistrement en cours |
| Traitement | Spinner, icône `Loader2` | Gemini analyse la dictée |
| Succès | Flash vert 1 seconde | Facture mise à jour |
| Erreur | Flash rouge, message court | Problème réseau ou API |

---

### Messages dans le fil de chat

**Message utilisateur (sa dictée) :**
```
                         ╔══════════════════════════╗
                         ║ "Michel SAS, réparation  ║
                         ║  4000€, entretien 2000€, ║
                         ║  TVA 20%"                ║
                         ╚══════════════════════════╝
```

**Réponse agent — actions live (apparaissent une par une) :**
```
╔══════════════════════════════════════╗
║  Compris ! Je mets à jour :          ║
║                                      ║
║  ✅ Client → Michel SAS              ║
║  ✅ Réparation — 4 000 €             ║
║  ✅ Entretien 2 mois — 2 000 €       ║
║  ✅ TVA → 20 %                       ║
║                                      ║
║  Total TTC : 7 200 €                 ║
╚══════════════════════════════════════╝
```

Chaque ligne `✅` apparaît **au fur et à mesure** que l'outil est appelé (streaming).
Pendant le traitement, afficher `⏳` qui se transforme en `✅` à la complétion.

---

### Feedback live sur la facture

Quand un champ est modifié par l'agent, le champ correspondant dans l'aperçu
doit **flasher brièvement** (highlight jaune 500ms) pour attirer l'oeil.

```ts
// Déclenché après chaque appel d'outil
setHighlightedField('client.name')   // flash jaune sur le nom client
setTimeout(() => setHighlightedField(null), 500)
```

Classe Tailwind pour l'effet :
```tsx
<span className={cn(
  "transition-colors duration-500",
  highlighted === 'client.name' && "bg-yellow-100 rounded"
)}>
  {invoice.client.name}
</span>
```

---

### Ton et wording de l'agent

L'agent répond de manière courte, directe et amicale :

| Situation | Message affiché |
|-----------|----------------|
| Démarrage écoute | "Je vous écoute..." |
| Traitement | "Analyse en cours..." |
| Succès complet | "Facture mise à jour ! Total TTC : X €" |
| Champ non compris | "Je n'ai pas saisi le montant, pouvez-vous répéter ?" |
| Erreur API | "Problème de connexion, réessayez dans un instant." |
| Inactif (first load) | "Dictez votre facture ou posez une question." |

---

### Palette de couleurs (variables thème existantes)

| Élément | Classe Tailwind |
|---------|----------------|
| Bulle utilisateur | `bg-primary text-primary-foreground` |
| Bulle agent | `bg-muted text-muted-foreground` |
| Badge outil en cours | `bg-yellow-100 text-yellow-800` |
| Badge outil terminé | `bg-green-100 text-green-800` |
| Bouton micro actif | `bg-destructive text-destructive-foreground animate-pulse` |
| Panneau fond | `bg-card border-r border-border` |

---

### Sélecteur de modèle (optionnel, en haut du panneau)

Un petit `<Select>` Shadcn discret en haut du chat pour changer de modèle sans
toucher au code :

```tsx
<Select value={model} onValueChange={setModel}>
  <SelectItem value="gemini-3-flash-preview">Flash — Rapide (gratuit)</SelectItem>
  <SelectItem value="gemini-2.5-pro">Pro — Précis (payant)</SelectItem>
</Select>
```

La valeur est persistée dans `localStorage` via un hook `useAIModel`.
