'use client'

import { FileText, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { InvoiceForm } from '@/components/invoice/invoice-form'
import { InvoicePreview } from '@/components/invoice/invoice-preview'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'
import { Button } from '@/components/ui/button'
import { loadInvoice, saveInvoice } from '@/lib/invoice-storage'
import { createDefaultInvoice, type InvoiceData } from '@/lib/invoice-types'

export default function Page() {
  const [invoice, setInvoice] = useState<InvoiceData>(createDefaultInvoice)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setInvoice(loadInvoice())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveInvoice(invoice)
  }, [invoice, mounted])

  const handleChange = (patch: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...patch }))
  }

  const handleReset = () => {
    if (
      window.confirm(
        '¿Empezar una factura nueva? Se perderán los datos actuales.',
      )
    ) {
      setInvoice(createDefaultInvoice())
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="size-4.5" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Facturia</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Facturas profesionales en segundos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Nueva</span>
            </Button>
            <PdfDownloadButton invoice={invoice} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* Editor */}
          <div>
            <h1 className="sr-only">Editor de facturas</h1>
            <InvoiceForm invoice={invoice} onChange={handleChange} />
          </div>

          {/* Vista previa */}
          <div className="lg:sticky lg:top-[76px] lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Vista previa
              </p>
              <p className="text-xs text-muted-foreground">
                Se guarda automáticamente en tu navegador
              </p>
            </div>
            <div className="rounded-2xl bg-muted/60 p-4 sm:p-6">
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
