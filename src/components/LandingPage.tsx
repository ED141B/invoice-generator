import { FileText, Zap, Eye, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  onStart: () => void
}

export function LandingPage({ onStart }: Props) {
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

        <Button size="lg" className="min-w-48 text-base h-12" onClick={onStart}>
          <FileText className="size-5 mr-2" />
          Créer une facture
        </Button>

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

      <footer className="border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          Invoice Generator — simple, rapide, gratuit.
        </p>
      </footer>
    </div>
  )
}
