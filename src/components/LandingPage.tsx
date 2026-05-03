import { FileText, ScrollText, Zap, Eye, Printer, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SavedInvoicesPanel } from "@/components/SavedInvoicesPanel"
import { SavedReceiptsPanel } from "@/components/SavedReceiptsPanel"
import type { SavedInvoice } from "@/types/savedInvoice"
import type { SavedReceipt } from "@/types/savedReceipt"

interface Props {
  onStart: () => void
  onStartReceipt: () => void
  savedInvoices: SavedInvoice[]
  onDuplicate: (id: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  savedReceipts: SavedReceipt[]
  onReceiptDuplicate: (id: string) => void
  onReceiptLoad: (id: string) => void
  onReceiptDelete: (id: string) => void
  onReceiptRename: (id: string, title: string) => void
}

export function LandingPage({
  onStart,
  onStartReceipt,
  savedInvoices,
  onDuplicate,
  onLoad,
  onDelete,
  onRename,
  savedReceipts,
  onReceiptDuplicate,
  onReceiptLoad,
  onReceiptDelete,
  onReceiptRename,
}: Props) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          <span className="font-semibold text-sm">Invoice Generator</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-8">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm">
          Gratuit · Aucune inscription
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-2xl">
          Créez vos factures
          <span className="text-primary"> en quelques secondes</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl">
          Remplissez le formulaire, visualisez votre facture en temps réel, puis imprimez-la ou exportez-la en PDF.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="min-w-44 text-base h-12" onClick={onStart}>
            <FileText className="size-5 mr-2" />
            Créer une facture
          </Button>
          <Button size="lg" variant="outline" className="min-w-44 text-base h-12" onClick={onStartReceipt}>
            <ScrollText className="size-5 mr-2" />
            Créer un reçu
          </Button>
        </div>

        {/* Fonctionnalités */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full text-left">
          {[
            {
              icon: <Zap className="size-5 text-yellow-500" />,
              title: "Rapide",
              desc: "Formulaire simple et clair, sans rien à configurer.",
            },
            {
              icon: <Eye className="size-5 text-blue-500" />,
              title: "Aperçu en direct",
              desc: "Votre facture se met à jour pendant que vous tapez.",
            },
            {
              icon: <Printer className="size-5 text-green-500" />,
              title: "Imprimable",
              desc: "Un clic pour imprimer ou sauvegarder en PDF.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-5 space-y-2">
              {f.icon}
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Dashboard : factures sauvegardées */}
      {savedInvoices.length > 0 && (
        <section className="border-t bg-background/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-10 space-y-6">
            <div className="flex items-center gap-3">
              <History className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Mes factures sauvegardées</h2>
              <Badge variant="secondary">{savedInvoices.length}</Badge>
            </div>
            <SavedInvoicesPanel
              savedInvoices={savedInvoices}
              onDuplicate={onDuplicate}
              onLoad={onLoad}
              onDelete={onDelete}
              onRename={onRename}
            />
          </div>
        </section>
      )}

      {/* Dashboard : reçus sauvegardés */}
      {savedReceipts.length > 0 && (
        <section className="border-t bg-background/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-10 space-y-6">
            <div className="flex items-center gap-3">
              <History className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Mes reçus sauvegardés</h2>
              <Badge variant="secondary">{savedReceipts.length}</Badge>
            </div>
            <SavedReceiptsPanel
              savedReceipts={savedReceipts}
              onDuplicate={onReceiptDuplicate}
              onLoad={onReceiptLoad}
              onDelete={onReceiptDelete}
              onRename={onReceiptRename}
            />
          </div>
        </section>
      )}

      <footer className="border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          Invoice Generator — simple, rapide, gratuit.
        </p>
      </footer>
    </div>
  )
}
