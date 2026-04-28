# Guide agent — Invoice Generator

## Objectif

Construire une application web React pour créer, éditer et gérer des factures professionnelles. L'utilisateur final est un freelance ou une petite entreprise. L'interface doit être claire, rapide et professionnelle.

---

## Stack technique

| Outil | Rôle | Version |
|---|---|---|
| Vite | Bundler / dev server | 8.x |
| React | UI framework | 19.x |
| TypeScript | Typage statique | 6.x |
| Tailwind CSS | Styles utilitaires | v4 |
| Shadcn/UI | Composants UI prêts à l'emploi | radix-nova style |
| Lucide React | Icônes | inclus via Shadcn |
| Radix UI | Primitives accessibles (base de Shadcn) | via `radix-ui` |

---

## Structure du projet

```
src/
├── components/
│   ├── ui/                  ← composants Shadcn (ne jamais modifier manuellement)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── table.tsx
│   ├── InvoiceForm.tsx      ← formulaire d'édition de la facture
│   └── InvoicePreview.tsx   ← aperçu imprimable de la facture
├── types/
│   └── invoice.ts           ← types TypeScript + fonctions utilitaires métier
├── lib/
│   └── utils.ts             ← helper cn() pour fusionner les classes Tailwind
├── App.tsx                  ← layout principal, état global de la facture
├── main.tsx                 ← montage React
└── index.css                ← variables CSS du thème (ne pas toucher)
```

---

## Architecture des données

Tout l'état de la facture vit dans `App.tsx` sous forme d'un seul objet `Invoice`. Les composants enfants reçoivent cet objet en prop et remontent les changements via `onChange`.

### Type principal (`src/types/invoice.ts`)

```ts
interface Invoice {
  number: string        // ex: "FAC-2026-001"
  date: string          // format ISO "YYYY-MM-DD"
  dueDate: string
  sender: {             // infos de l'émetteur (le freelance/société)
    name: string
    address: string
    email: string
    phone: string
  }
  client: {             // infos du destinataire
    name: string
    address: string
    email: string
  }
  items: InvoiceItem[]  // lignes de prestation
  notes: string
  taxRate: number       // taux de TVA en pourcentage (ex: 20)
}

interface InvoiceItem {
  id: string            // généré via crypto.randomUUID()
  description: string
  quantity: number
  unitPrice: number
}
```

### Fonctions utilitaires disponibles dans `invoice.ts`

| Fonction | Rôle |
|---|---|
| `createEmptyInvoice()` | Crée une facture vierge avec date du jour et échéance +30j |
| `createEmptyItem()` | Crée une ligne de prestation vide avec un id unique |
| `computeTotals(items, taxRate)` | Retourne `{ subtotal, tax, total }` |

### Pattern de modification d'état

Le composant parent passe `invoice` + `onChange`. Les enfants ne modifient jamais directement — ils appellent `onChange` avec un nouvel objet.

```tsx
// Dans App.tsx
const [invoice, setInvoice] = useState<Invoice>(createEmptyInvoice)
<InvoiceForm invoice={invoice} onChange={setInvoice} />

// Dans InvoiceForm.tsx
function set<K extends keyof Invoice>(key: K, value: Invoice[K]) {
  onChange({ ...invoice, [key]: value })
}
```

Ne pas casser ce pattern. Tout nouveau composant d'édition doit suivre la même convention `{ invoice, onChange }`.

---

## Fonctionnalités déjà construites

Ne pas reconstruire ce qui existe déjà.

| Fonctionnalité | Fichier | État |
|---|---|---|
| Types et utilitaires facture | `src/types/invoice.ts` | ✅ fait |
| Formulaire d'édition complet | `src/components/InvoiceForm.tsx` | ✅ fait |
| Aperçu imprimable temps réel | `src/components/InvoicePreview.tsx` | ✅ fait |
| Layout principal avec header | `src/App.tsx` | ✅ fait |
| Bouton imprimer / mode aperçu | `src/App.tsx` | ✅ fait |

---

## Règles impératives

### 1. Toujours utiliser Shadcn/UI pour les composants

Ne jamais créer manuellement un bouton, un champ de formulaire, une carte, un modal, un menu déroulant ou tout autre élément si Shadcn en propose un.

**Ajouter un composant Shadcn :**
```bash
npx shadcn@latest add [nom]
# exemples : button, input, card, dialog, select, table, form, label, separator
```

Les composants s'installent dans `src/components/ui/`.

**Utilisation :**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

### 2. Alias `@/` pour les imports

Toujours utiliser `@/` au lieu de chemins relatifs comme `../../`.

```tsx
// Correct
import { cn } from "@/lib/utils"

// Interdit
import { cn } from "../../lib/utils"
```

### 3. TypeScript strict

Typer toutes les props et les états. Pas de `any`. Utiliser des interfaces pour les données métier (facture, client, ligne de produit).

```tsx
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}
```

### 4. Styles : Tailwind uniquement

Ne pas écrire de CSS custom dans des fichiers `.css` séparés. Utiliser les classes Tailwind et les variables du thème (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.).

Pour fusionner des classes conditionnelles, utiliser `cn()` :
```tsx
import { cn } from "@/lib/utils"

<div className={cn("p-4 rounded-lg", isActive && "bg-primary text-primary-foreground")} />
```

### 5. Icônes : Lucide React uniquement

```tsx
import { FileText, Plus, Trash2, Download } from "lucide-react"
```

---

## Commandes disponibles

```bash
npm run dev      # serveur de développement → http://localhost:5173
npm run build    # build production
npm run lint     # vérification ESLint
```

---

## Pièges connus

- **Shadcn exporte composant + variantes** (ex: `buttonVariants`) — ESLint se plaint. Ajouter `// eslint-disable-next-line react-refresh/only-export-components` avant la ligne d'export concernée.
- **`baseUrl` dans tsconfig** — Option dépréciée en TS 6. Ne pas l'ajouter. Les alias `@/*` fonctionnent sans elle avec `moduleResolution: "bundler"`.
- **Réinstallation des modules** — Si `rolldown` ou un binding natif est manquant après `npm install`, supprimer `node_modules` et `package-lock.json` puis réinstaller.

---

## Prochaines fonctionnalités possibles

Liste indicative — ne rien implémenter sans que l'utilisateur le demande.

- **Sauvegarde locale** — persister la facture dans `localStorage` pour ne pas perdre les données au rechargement
- **Plusieurs factures** — liste de factures avec navigation
- **Export PDF** — via `@react-pdf/renderer` ou `html2pdf.js`
- **Logo entreprise** — upload d'une image dans l'en-tête de la facture
- **Modèles de facture** — plusieurs designs d'aperçu au choix
- **Devise configurable** — EUR, USD, GBP, etc.
- **Remise** — champ de remise en % ou montant fixe par ligne ou global

---

## Comportement attendu de l'agent

- Lire `src/types/invoice.ts` en premier avant toute modification — c'est la source de vérité des données.
- Vérifier la section "Fonctionnalités déjà construites" avant de coder quoi que ce soit.
- Implémenter une fonctionnalité à la fois, lancer `npm run build` pour vérifier, puis committer.
- Faire un `git commit` après chaque fonctionnalité terminée — ne pas attendre d'avoir tout fini.
- Communiquer simplement avec l'utilisateur : pas de jargon technique, des phrases courtes.
- Ne pas ajouter de fonctionnalités non demandées.
- Ne pas créer de fichiers de documentation supplémentaires sauf si demandé.
