import { useState, useRef, useEffect } from "react"
import { FileText, Printer, ArrowLeft, Bookmark, Library, RotateCcw, Eye, EyeOff, PenLine, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingPage } from "@/components/LandingPage"
import { NoiseTransition } from "@/components/NoiseTransition"
import { NoiseTransitionBack } from "@/components/NoiseTransitionBack"
import { DemonSlayerTransition } from "@/components/DemonSlayerTransition"
import { PillarTransition } from "@/components/PillarTransition"
import { InvoicePreview } from "@/components/InvoicePreview"
import { InvoiceForm } from "@/components/InvoiceForm"
import { VoiceChatbot } from "@/components/VoiceChatbot"
import { ReceiptEditor } from "@/components/ReceiptEditor"
import { ExpenseEditor } from "@/components/ExpenseEditor"
import { AssociationReceiptEditor } from "@/components/AssociationReceiptEditor"
import { SaveInvoiceDialog } from "@/components/SaveInvoiceDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { SavedInvoicesPanel } from "@/components/SavedInvoicesPanel"
import { createEmptyInvoice, generateNextInvoiceNumber, type Invoice } from "@/types/invoice"
import { createEmptyReceipt, generateNextReceiptNumber, type Receipt } from "@/types/receipt"
import { createEmptyExpenseReport, generateNextExpenseNumber, type ExpenseReport } from "@/types/expense"
import { createEmptyAssociationReceipt, generateNextArNumber, type AssociationReceipt } from "@/types/associationReceipt"
import { useSavedInvoices } from "@/hooks/useSavedInvoices"
import { useSavedReceipts } from "@/hooks/useSavedReceipts"
import { useSavedExpenses } from "@/hooks/useSavedExpenses"
import { useSavedAssociationReceipts } from "@/hooks/useSavedAssociationReceipts"

type Page = "landing" | "transitioning" | "transitioning-back" | "transitioning-receipt" | "transitioning-receipt-back" | "transitioning-expense" | "transitioning-expense-back" | "transitioning-association-receipt" | "transitioning-association-receipt-back" | "editor" | "receipt-editor" | "expense-editor" | "association-receipt-editor"

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [invoice, setInvoice] = useState<Invoice>(createEmptyInvoice)
  const [receipt, setReceipt] = useState<Receipt>(() => createEmptyReceipt())
  const [expense, setExpense] = useState<ExpenseReport>(() => createEmptyExpenseReport())
  const [associationReceipt, setAssociationReceipt] = useState<AssociationReceipt>(() => createEmptyAssociationReceipt())
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showReusePanel, setShowReusePanel] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showManual, setShowManual] = useState(false)

  const { savedInvoices, saveInvoice, renameInvoice, removeInvoice, duplicateInvoice } = useSavedInvoices()
  const { savedReceipts, saveReceipt, renameReceipt, removeReceipt, duplicateReceipt } = useSavedReceipts()
  const { savedExpenses, saveExpense, renameExpense, removeExpense, duplicateExpense, cloneSavedExpense } = useSavedExpenses()
  const { savedAssociationReceipts, saveAssociationReceipt, renameAssociationReceipt, removeAssociationReceipt, duplicateAssociationReceipt, cloneSavedAssociationReceipt } = useSavedAssociationReceipts()

  const invoiceRef = useRef<Invoice>(invoice)
  const receiptRef = useRef<Receipt>(receipt)
  const expenseRef = useRef<ExpenseReport>(expense)
  const associationReceiptRef = useRef<AssociationReceipt>(associationReceipt)
  useEffect(() => { invoiceRef.current = invoice }, [invoice])
  useEffect(() => { receiptRef.current = receipt }, [receipt])
  useEffect(() => { expenseRef.current = expense }, [expense])
  useEffect(() => { associationReceiptRef.current = associationReceipt }, [associationReceipt])

  // ── Invoice handlers ────────────────────────────────────────────────────────

  function handleInvoiceDuplicate(id: string) {
    const inv = duplicateInvoice(id)
    if (!inv) return
    const existingNumbers = savedInvoices.map((s) => s.invoice.number)
    setInvoice({ ...inv, number: generateNextInvoiceNumber(existingNumbers) })
    setShowReusePanel(false)
    if (page !== "editor") setPage("transitioning")
  }

  function handleInvoiceLoad(id: string) {
    const inv = duplicateInvoice(id)
    if (!inv) return
    setInvoice(inv)
    setShowReusePanel(false)
    if (page !== "editor") setPage("transitioning")
  }

  function handleInvoiceReset() {
    const fresh = createEmptyInvoice()
    const existingNumbers = savedInvoices.map((s) => s.invoice.number)
    setInvoice({ ...fresh, number: generateNextInvoiceNumber(existingNumbers) })
    setShowReusePanel(false)
    setShowResetConfirm(false)
  }

  // ── Expense handlers ────────────────────────────────────────────────────────

  function handleExpenseLoad(id: string) {
    const exp = duplicateExpense(id)
    if (!exp) return
    setExpense(exp)
    if (page !== "expense-editor") setPage("transitioning-expense")
  }

  function handleExpenseReset() {
    const fresh = createEmptyExpenseReport()
    const existingNumbers = savedExpenses.map((s) => s.expense.number)
    setExpense({ ...fresh, number: generateNextExpenseNumber(existingNumbers) })
  }

  // ── Receipt handlers ────────────────────────────────────────────────────────

  function handleReceiptDuplicate(id: string) {
    const rec = duplicateReceipt(id)
    if (!rec) return
    const existingNumbers = savedReceipts.map((s) => s.receipt.number)
    setReceipt({ ...rec, number: generateNextReceiptNumber(existingNumbers) })
    if (page !== "receipt-editor") setPage("transitioning-receipt")
  }

  function handleReceiptLoad(id: string) {
    const rec = duplicateReceipt(id)
    if (!rec) return
    setReceipt(rec)
    if (page !== "receipt-editor") setPage("transitioning-receipt")
  }

  function handleReceiptReset() {
    const fresh = createEmptyReceipt()
    const existingNumbers = savedReceipts.map((s) => s.receipt.number)
    setReceipt({ ...fresh, number: generateNextReceiptNumber(existingNumbers) })
  }

  // ── Association Receipt handlers ────────────────────────────────────────────

  function handleAssociationReceiptDuplicate(id: string) {
    const rec = duplicateAssociationReceipt(id)
    if (!rec) return
    const existingNumbers = savedAssociationReceipts.map((s) => s.receipt.number)
    setAssociationReceipt({ ...rec, number: generateNextArNumber(existingNumbers) })
    if (page !== "association-receipt-editor") setPage("transitioning-association-receipt")
  }

  function handleAssociationReceiptLoad(id: string) {
    const rec = duplicateAssociationReceipt(id)
    if (!rec) return
    setAssociationReceipt(rec)
    if (page !== "association-receipt-editor") setPage("transitioning-association-receipt")
  }

  function handleAssociationReceiptReset() {
    const fresh = createEmptyAssociationReceipt()
    const existingNumbers = savedAssociationReceipts.map((s) => s.receipt.number)
    setAssociationReceipt({ ...fresh, number: generateNextArNumber(existingNumbers) })
  }

  // ── Panel management ────────────────────────────────────────────────────────

  function closeAllPanels() {
    setShowPreview(false)
    setShowReusePanel(false)
    setShowManual(false)
  }

  // ── Routing ─────────────────────────────────────────────────────────────────

  if (page === "landing") {
    return (
      <LandingPage
        onStart={() => setPage("transitioning")}
        onStartReceipt={() => {
          setReceipt(createEmptyReceipt(invoice.sender))
          setPage("transitioning-receipt")
        }}
        onStartExpense={() => setPage("transitioning-expense")}
        onStartAssociationReceipt={() => setPage("transitioning-association-receipt")}
        savedInvoices={savedInvoices}
        onDuplicate={handleInvoiceDuplicate}
        onLoad={handleInvoiceLoad}
        onDelete={removeInvoice}
        onRename={renameInvoice}
        savedReceipts={savedReceipts}
        onReceiptDuplicate={handleReceiptDuplicate}
        onReceiptLoad={handleReceiptLoad}
        onReceiptDelete={removeReceipt}
        onReceiptRename={renameReceipt}
        savedExpenses={savedExpenses}
        onExpenseDuplicate={cloneSavedExpense}
        onExpenseLoad={handleExpenseLoad}
        onExpenseDelete={removeExpense}
        onExpenseRename={renameExpense}
        savedAssociationReceipts={savedAssociationReceipts}
        onAssociationReceiptDuplicate={handleAssociationReceiptDuplicate}
        onAssociationReceiptLoad={handleAssociationReceiptLoad}
        onAssociationReceiptDelete={removeAssociationReceipt}
        onAssociationReceiptRename={renameAssociationReceipt}
      />
    )
  }

  if (page === "transitioning-expense") {
    return <NoiseTransition onComplete={() => setPage("expense-editor")} />
  }

  if (page === "transitioning-expense-back") {
    return <NoiseTransitionBack onComplete={() => setPage("landing")} />
  }

  if (page === "expense-editor") {
    return (
      <ExpenseEditor
        expense={expense}
        onChange={setExpense}
        onBack={() => setPage("transitioning-expense-back")}
        savedExpenses={savedExpenses}
        onSave={(title) => saveExpense(title, expenseRef.current)}
        onLoad={handleExpenseLoad}
        onDuplicate={cloneSavedExpense}
        onDelete={removeExpense}
        onRename={renameExpense}
        onReset={handleExpenseReset}
      />
    )
  }

  if (page === "transitioning-receipt") {
    return <DemonSlayerTransition onComplete={() => setPage("receipt-editor")} />
  }

  if (page === "transitioning-receipt-back") {
    return <PillarTransition onComplete={() => setPage("landing")} />
  }

  if (page === "receipt-editor") {
    return (
      <ReceiptEditor
        receipt={receipt}
        onChange={setReceipt}
        onBack={() => setPage("transitioning-receipt-back")}
        savedReceipts={savedReceipts}
        onSave={(title) => saveReceipt(title, receiptRef.current)}
        onLoad={handleReceiptLoad}
        onDuplicate={handleReceiptDuplicate}
        onDelete={removeReceipt}
        onRename={renameReceipt}
        onReset={handleReceiptReset}
      />
    )
  }

  if (page === "transitioning-association-receipt") {
    return <NoiseTransition onComplete={() => setPage("association-receipt-editor")} />
  }

  if (page === "transitioning-association-receipt-back") {
    return <NoiseTransitionBack onComplete={() => setPage("landing")} />
  }

  if (page === "association-receipt-editor") {
    return (
      <AssociationReceiptEditor
        receipt={associationReceipt}
        onChange={setAssociationReceipt}
        onBack={() => setPage("transitioning-association-receipt-back")}
        savedAssociationReceipts={savedAssociationReceipts}
        onSave={(title) => saveAssociationReceipt(title, associationReceiptRef.current)}
        onLoad={handleAssociationReceiptLoad}
        onDuplicate={cloneSavedAssociationReceipt}
        onDelete={removeAssociationReceipt}
        onRename={renameAssociationReceipt}
        onReset={handleAssociationReceiptReset}
      />
    )
  }

  if (page === "transitioning") {
    return <NoiseTransition onComplete={() => setPage("editor")} />
  }

  if (page === "transitioning-back") {
    return <NoiseTransitionBack onComplete={() => setPage("landing")} />
  }

  return (
    <div className="min-h-svh bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Retour à l'accueil" onClick={() => setPage("transitioning-back")}>
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span className="font-semibold text-sm hidden sm:inline">Invoice Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={showReusePanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowReusePanel(!showReusePanel)}
            >
              <Library className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Réutiliser</span>
              {savedInvoices.length > 0 && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 leading-none font-medium ${showReusePanel ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {savedInvoices.length}
                </span>
              )}
            </Button>
            <Button
              variant={showManual ? "default" : "outline"}
              size="sm"
              onClick={() => {
                closeAllPanels()
                setShowManual(!showManual)
              }}
            >
              {showManual ? <MessageSquare className="size-4 sm:mr-1.5" /> : <PenLine className="size-4 sm:mr-1.5" />}
              <span className="hidden sm:inline">{showManual ? "Chatbot" : "Manuel"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                closeAllPanels()
                setShowPreview(!showPreview)
              }}
            >
              {showPreview ? <EyeOff className="size-4 sm:mr-1.5" /> : <Eye className="size-4 sm:mr-1.5" />}
              <span className="hidden sm:inline">{showPreview ? "Masquer" : "Aperçu"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
            >
              <Bookmark className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      {showReusePanel ? (
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Réutiliser une facture
            </h2>
            <SavedInvoicesPanel
              savedInvoices={savedInvoices}
              onDuplicate={handleInvoiceDuplicate}
              onLoad={handleInvoiceLoad}
              onDelete={removeInvoice}
              onRename={renameInvoice}
            />
          </div>
        </main>
      ) : showPreview ? (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <InvoicePreview invoice={invoice} />
          </div>
        </main>
      ) : showManual ? (
        <main className="container mx-auto px-4 py-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Édition manuelle</h2>
              <InvoiceForm invoice={invoice} onChange={setInvoice} />
            </div>
            <div className="xl:sticky xl:top-22">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Aperçu en temps réel</h2>
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </main>
      ) : (
        <div className="flex overflow-hidden">
          <VoiceChatbot invoice={invoice} onChange={setInvoice} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            <InvoicePreview invoice={invoice} />
          </main>
        </div>
      )}

      {showSaveDialog && (
        <SaveInvoiceDialog
          invoice={invoice}
          onSave={(title) => saveInvoice(title, invoiceRef.current)}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {showResetConfirm && (
        <ConfirmDialog
          title="Réinitialiser la facture"
          message="Êtes-vous sûr ? Les modifications non sauvegardées seront perdues. Les factures déjà sauvegardées dans l'historique ne seront pas affectées."
          confirmLabel="Oui, réinitialiser"
          onConfirm={handleInvoiceReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  )
}
