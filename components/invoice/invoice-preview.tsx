'use client'

import type { InvoiceData } from '@/lib/invoice-types'
import { computeTotals, formatDate, formatMoney } from '@/lib/invoice-utils'

export function InvoicePreview({ invoice }: { invoice: InvoiceData }) {
  const { subtotal, tax, total } = computeTotals(invoice)
  const accent = invoice.accentColor || '#2f4bd6'

  return (
    <div
      className="mx-auto flex aspect-[210/297] w-full max-w-[640px] flex-col bg-white p-8 text-[11px] leading-relaxed text-slate-800 shadow-lg ring-1 ring-slate-200 sm:p-10"
      aria-label="Vista previa de la factura"
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {invoice.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={invoice.companyLogo || '/placeholder.svg'}
              alt={`Logo de ${invoice.companyName || 'la empresa'}`}
              className="mb-2 h-12 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <p className="text-lg font-bold" style={{ color: accent }}>
              {invoice.companyName || 'Tu empresa'}
            </p>
          )}
          {invoice.companyLogo && invoice.companyName ? (
            <p className="text-sm font-bold text-slate-900">
              {invoice.companyName}
            </p>
          ) : null}
          <div className="mt-1 space-y-0.5 text-[10px] text-slate-500">
            {invoice.companyTaxId ? <p>NIF/CIF: {invoice.companyTaxId}</p> : null}
            {invoice.companyAddress ? (
              <p className="whitespace-pre-line">{invoice.companyAddress}</p>
            ) : null}
            {invoice.companyEmail ? <p>{invoice.companyEmail}</p> : null}
            {invoice.companyPhone ? <p>{invoice.companyPhone}</p> : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p
            className="text-2xl font-bold tracking-wide"
            style={{ color: accent }}
          >
            FACTURA
          </p>
          <p className="text-slate-500">{invoice.invoiceNumber || '—'}</p>
          <div className="mt-3 space-y-1">
            <div>
              <p className="text-[8px] uppercase tracking-wide text-slate-400">
                Fecha de emisión
              </p>
              <p className="font-semibold text-slate-800">
                {formatDate(invoice.issueDate)}
              </p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wide text-slate-400">
                Vencimiento
              </p>
              <p className="font-semibold text-slate-800">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cliente */}
      <div className="mt-7 rounded-md bg-slate-50 p-4">
        <p className="mb-1.5 text-[8px] uppercase tracking-widest text-slate-400">
          Facturar a
        </p>
        <p className="text-sm font-bold text-slate-900">
          {invoice.clientName || 'Nombre del cliente'}
        </p>
        <div className="mt-0.5 space-y-0.5 text-[10px] text-slate-500">
          {invoice.clientTaxId ? <p>NIF/CIF: {invoice.clientTaxId}</p> : null}
          {invoice.clientAddress ? (
            <p className="whitespace-pre-line">{invoice.clientAddress}</p>
          ) : null}
          {invoice.clientEmail ? <p>{invoice.clientEmail}</p> : null}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-7">
        <div className="flex border-y border-slate-200 px-2 py-2 text-[8px] font-bold uppercase tracking-wide text-slate-400">
          <span className="flex-[5]">Descripción</span>
          <span className="flex-[1.4] text-right">Cant.</span>
          <span className="flex-[2] text-right">Precio</span>
          <span className="flex-[2] text-right">Importe</span>
        </div>
        {invoice.items.map((item) => {
          const amount = (Number(item.quantity) || 0) * (Number(item.price) || 0)
          return (
            <div
              key={item.id}
              className="flex border-b border-slate-100 px-2 py-2.5"
            >
              <span className="flex-[5] pr-2 text-slate-700">
                {item.description || (
                  <span className="text-slate-300">Concepto sin descripción</span>
                )}
              </span>
              <span className="flex-[1.4] text-right tabular-nums">
                {item.quantity}
              </span>
              <span className="flex-[2] text-right tabular-nums">
                {formatMoney(Number(item.price) || 0, invoice.currency)}
              </span>
              <span className="flex-[2] text-right font-medium tabular-nums">
                {formatMoney(amount, invoice.currency)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totales */}
      <div className="mt-4 ml-auto w-full max-w-[240px]">
        <div className="flex justify-between py-1 text-slate-500">
          <span>Subtotal</span>
          <span className="tabular-nums text-slate-700">
            {formatMoney(subtotal, invoice.currency)}
          </span>
        </div>
        <div className="flex justify-between py-1 text-slate-500">
          <span>IVA ({Number(invoice.taxRate) || 0}%)</span>
          <span className="tabular-nums text-slate-700">
            {formatMoney(tax, invoice.currency)}
          </span>
        </div>
        <div
          className="mt-2 flex items-center justify-between rounded-md px-3 py-2.5 text-white"
          style={{ backgroundColor: accent }}
        >
          <span className="text-sm font-bold">TOTAL</span>
          <span className="text-base font-bold tabular-nums">
            {formatMoney(total, invoice.currency)}
          </span>
        </div>
      </div>

      {/* Notas */}
      {invoice.notes ? (
        <div className="mt-auto border-t border-slate-200 pt-3">
          <p className="mb-1 text-[8px] uppercase tracking-widest text-slate-400">
            Notas
          </p>
          <p className="whitespace-pre-line text-[10px] text-slate-500">
            {invoice.notes}
          </p>
        </div>
      ) : null}
    </div>
  )
}
