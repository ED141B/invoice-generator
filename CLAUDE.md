# Invoice Generator

Application web React pour créer et imprimer des factures professionnelles. Cible : freelances et petites entreprises.

---

## Stack

| Outil | Rôle |
|---|---|
| Vite 8 + React 19 + TypeScript 6 | Base du projet |
| Tailwind CSS v4 | Styles (utilitaires uniquement, pas de CSS custom) |
| Shadcn/UI (style `radix-nova`) | Composants UI — à utiliser EN PRIORITÉ |
| Lucide React | Icônes uniquement |

---

## Commandes

```bash
npm run dev      # http://localhost:5173
npm run build    # vérifie TypeScript + build prod — toujours lancer avant de committer
npm run lint     # vérifie ESLint
```

---

## Ce qui est déjà construit — ne pas recréer

```
src/
├── types/invoice.ts          ← types Invoice, InvoiceItem + fonctions utilitaires
├── components/
│   ├── LandingPage.tsx       ← page d'accueil avec CTA
│   ├── InvoiceForm.tsx       ← formulaire d'édition complet
│   ├── InvoicePreview.tsx    ← aperçu imprimable temps réel
│   └── ui/                  ← composants Shadcn (badge, button, card, input,
│                                label, select, separator, table)
├── App.tsx                   ← navigation entre pages + état global Invoice
└── index.css                 ← thème CSS (ne pas modifier)
```

**Navigation :** `App.tsx` gère une variable `page: "landing" | "editor"`. Pour ajouter une page, ajouter sa valeur à ce type et un `if (page === "...")` dans App.tsx.

---

## Architecture des données

Tout l'état de la facture vit dans `App.tsx` comme un seul objet `Invoice` défini dans `src/types/invoice.ts`. C'est la source de vérité — lire ce fichier avant toute modification.

```ts
// Résumé du type Invoice
{
  number, date, dueDate,
  sender: { name, address, email, phone },
  client: { name, address, email },
  items: InvoiceItem[],   // { id, description, quantity, unitPrice }
  notes,
  taxRate                 // en pourcentage, ex: 20
}
```

**Fonctions utilitaires disponibles dans `invoice.ts` :**
- `createEmptyInvoice()` — facture vierge avec date du jour
- `createEmptyItem()` — ligne de prestation avec id unique
- `computeTotals(items, taxRate)` — retourne `{ subtotal, tax, total }`

**Pattern obligatoire pour les composants d'édition :**
```tsx
// Les enfants ne modifient jamais l'état directement
interface Props {
  invoice: Invoice
  onChange: (invoice: Invoice) => void
}
```

---

## Règles impératives

### Composants UI : Shadcn uniquement

Ne jamais créer un bouton, input, card, dialog, select ou badge manuellement.

```bash
# Vérifier si un composant existe avant de coder
npx shadcn@latest add [nom]   # installe dans src/components/ui/
```

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

### Imports : alias `@/` obligatoire

```tsx
import { cn } from "@/lib/utils"       // ✅
import { cn } from "../../lib/utils"   // ❌
```

### Styles : variables du thème Tailwind

Utiliser les variables du thème, pas des couleurs en dur :

```tsx
// ✅ Correct
<p className="text-muted-foreground bg-card border-border" />

// ❌ Interdit
<p className="text-gray-500 bg-white border-gray-200" />
```

Pour les classes conditionnelles, utiliser `cn()` :
```tsx
import { cn } from "@/lib/utils"
<div className={cn("p-4", isActive && "bg-primary text-primary-foreground")} />
```

### TypeScript : pas de `any`

Typer toutes les props et tous les états. Étendre les types existants dans `invoice.ts` plutôt qu'en créer de nouveaux.

### Icônes : Lucide React uniquement

```tsx
import { FileText, Plus, Trash2, Download, ArrowLeft } from "lucide-react"
```

---

## Avant de committer

1. `npm run build` — doit passer sans erreur TypeScript
2. `npm run lint` — doit passer sans erreur ESLint
3. Tester dans le navigateur le chemin principal (landing → éditeur → aperçu → impression)
4. `git commit` avec un message clair

---

## Pièges à éviter

- **Ne pas modifier `src/components/ui/`** — ces fichiers sont gérés par Shadcn. Si ESLint se plaint d'un export (ex: `buttonVariants`), ajouter `// eslint-disable-next-line react-refresh/only-export-components` sur la ligne concernée.
- **Ne pas ajouter `baseUrl` dans tsconfig** — déprécié en TS 6, les alias `@/*` fonctionnent sans.
- **Ne pas écrire de CSS dans des fichiers `.css`** — Tailwind uniquement.
- **Ne pas utiliser `window.location` pour la navigation** — utiliser la variable `page` dans `App.tsx`.

---

## Communication avec Edmond

- Phrases courtes, pas de jargon technique
- Expliquer CE QUE ça fait, pas COMMENT ça marche en interne
- Dire ce qui a changé et ce qui reste à faire — rien de plus
