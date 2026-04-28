import { useState } from "react"
import { FileText, Eye, EyeOff, Printer, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingPage } from "@/components/LandingPage"
import { NoiseTransition } from "@/components/NoiseTransition"
import { InvoiceForm } from "@/components/InvoiceForm"
import { InvoicePreview } from "@/components/InvoicePreview"
import { createEmptyInvoice, type Invoice } from "@/types/invoice"

type Page = "landing" | "transitioning" | "editor"

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [invoice, setInvoice] = useState<Invoice>(createEmptyInvoice)
  const [showPreview, setShowPreview] = useState(false)

  if (page === "landing") {
    return <LandingPage onStart={() => setPage("transitioning")} />
  }

  if (page === "transitioning") {
    return <NoiseTransition onComplete={() => setPage("editor")} />
  }

  return (
    <div className="min-h-svh bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setPage("landing")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span className="font-semibold text-sm">Invoice Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="size-4 mr-1.5" /> : <Eye className="size-4 mr-1.5" />}
              {showPreview ? "Masquer l'aperçu" : "Aperçu"}
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4 mr-1.5" />
              Imprimer
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="container mx-auto px-4 py-8">
        {showPreview ? (
          <div className="max-w-3xl mx-auto">
            <InvoicePreview invoice={invoice} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Édition</h2>
              <InvoiceForm invoice={invoice} onChange={setInvoice} />
            </div>
            <div className="xl:sticky xl:top-22">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Aperçu en temps réel</h2>
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
