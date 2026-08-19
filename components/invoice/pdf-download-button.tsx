'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { InvoiceData } from '@/lib/invoice-types'

export function PdfDownloadButton({ invoice }: { invoice: InvoiceData }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const [{ pdf }, { InvoicePdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./invoice-pdf'),
      ])
      const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const safeNumber = (invoice.invoiceNumber || 'factura').replace(
        /[^a-z0-9-_]/gi,
        '-',
      )
      link.download = `${safeNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('[v0] Error al generar el PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} size="lg" className="gap-2">
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="size-4" aria-hidden="true" />
      )}
      {loading ? 'Generando…' : 'Descargar PDF'}
    </Button>
  )
}
