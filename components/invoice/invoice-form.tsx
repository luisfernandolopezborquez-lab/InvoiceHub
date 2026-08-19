'use client'

import { ImageIcon, Plus, Trash2, X } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  createEmptyItem,
  CURRENCIES,
  type InvoiceData,
  type LineItem,
} from '@/lib/invoice-types'
import { formatMoney } from '@/lib/invoice-utils'

type Props = {
  invoice: InvoiceData
  onChange: (patch: Partial<InvoiceData>) => void
}

const ACCENT_PRESETS = [
  '#2f4bd6',
  '#0f766e',
  '#b91c1c',
  '#7c3aed',
  '#c2410c',
  '#0f172a',
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function InvoiceForm({ invoice, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onChange({ companyLogo: reader.result as string })
    reader.readAsDataURL(file)
  }

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    onChange({
      items: invoice.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })
  }

  const removeItem = (id: string) => {
    onChange({ items: invoice.items.filter((item) => item.id !== id) })
  }

  const addItem = () => {
    onChange({ items: [...invoice.items, createEmptyItem()] })
  }

  return (
    <div className="space-y-5">
      <Section
        title="Tu empresa"
        description="Estos datos aparecen en la cabecera de la factura."
      >
        <Field label="Logotipo">
          {invoice.companyLogo ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={invoice.companyLogo || '/placeholder.svg'}
                alt="Logotipo de la empresa"
                className="h-12 w-auto max-w-[140px] rounded-md border border-border bg-white object-contain p-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange({ companyLogo: null })}
              >
                <X className="size-3.5" aria-hidden="true" />
                Quitar
              </Button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <ImageIcon className="size-4" aria-hidden="true" />
                Subir logotipo (PNG o JPG)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="sr-only"
              />
            </>
          )}
        </Field>

        <Field label="Nombre de la empresa" htmlFor="companyName">
          <Input
            id="companyName"
            value={invoice.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Mi Empresa S.L."
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="NIF / CIF" htmlFor="companyTaxId">
            <Input
              id="companyTaxId"
              value={invoice.companyTaxId}
              onChange={(e) => onChange({ companyTaxId: e.target.value })}
              placeholder="B12345678"
            />
          </Field>
          <Field label="Teléfono" htmlFor="companyPhone">
            <Input
              id="companyPhone"
              value={invoice.companyPhone}
              onChange={(e) => onChange({ companyPhone: e.target.value })}
              placeholder="+34 600 000 000"
            />
          </Field>
        </div>

        <Field label="Email" htmlFor="companyEmail">
          <Input
            id="companyEmail"
            type="email"
            value={invoice.companyEmail}
            onChange={(e) => onChange({ companyEmail: e.target.value })}
            placeholder="hola@miempresa.com"
          />
        </Field>

        <Field label="Dirección" htmlFor="companyAddress">
          <Textarea
            id="companyAddress"
            value={invoice.companyAddress}
            onChange={(e) => onChange({ companyAddress: e.target.value })}
            placeholder="Calle Ejemplo 1, 28001 Madrid"
            rows={2}
          />
        </Field>
      </Section>

      <Section title="Cliente" description="A quién va dirigida la factura.">
        <Field label="Nombre del cliente" htmlFor="clientName">
          <Input
            id="clientName"
            value={invoice.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="Cliente S.A."
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="NIF / CIF" htmlFor="clientTaxId">
            <Input
              id="clientTaxId"
              value={invoice.clientTaxId}
              onChange={(e) => onChange({ clientTaxId: e.target.value })}
              placeholder="A87654321"
            />
          </Field>
          <Field label="Email" htmlFor="clientEmail">
            <Input
              id="clientEmail"
              type="email"
              value={invoice.clientEmail}
              onChange={(e) => onChange({ clientEmail: e.target.value })}
              placeholder="cliente@correo.com"
            />
          </Field>
        </div>
        <Field label="Dirección" htmlFor="clientAddress">
          <Textarea
            id="clientAddress"
            value={invoice.clientAddress}
            onChange={(e) => onChange({ clientAddress: e.target.value })}
            placeholder="Avenida Cliente 2, 08001 Barcelona"
            rows={2}
          />
        </Field>
      </Section>

      <Section title="Detalles de la factura">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Número de factura" htmlFor="invoiceNumber">
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              placeholder="FAC-2026-001"
            />
          </Field>
          <Field label="Moneda">
            <Select
              value={invoice.currency}
              onValueChange={(value) => onChange({ currency: value as string })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Fecha de emisión" htmlFor="issueDate">
            <Input
              id="issueDate"
              type="date"
              value={invoice.issueDate}
              onChange={(e) => onChange({ issueDate: e.target.value })}
            />
          </Field>
          <Field label="Vencimiento" htmlFor="dueDate">
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onChange({ dueDate: e.target.value })}
            />
          </Field>
          <Field label="IVA (%)" htmlFor="taxRate">
            <Input
              id="taxRate"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={invoice.taxRate}
              onChange={(e) =>
                onChange({
                  taxRate: e.target.value === '' ? 0 : Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Color de marca">
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Selector de color de marca"
                value={invoice.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
              <div className="flex flex-wrap gap-1.5">
                {ACCENT_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Usar color ${color}`}
                    onClick={() => onChange({ accentColor: color })}
                    className="size-6 rounded-full ring-1 ring-black/10 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Conceptos">
        <div className="space-y-3">
          {/* Cabecera (solo escritorio) */}
          <div className="hidden grid-cols-[1fr_72px_100px_100px_36px] gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <span>Descripción</span>
            <span className="text-right">Cant.</span>
            <span className="text-right">Precio</span>
            <span className="text-right">Importe</span>
            <span className="sr-only">Acciones</span>
          </div>

          {invoice.items.map((item) => {
            const amount =
              (Number(item.quantity) || 0) * (Number(item.price) || 0)
            return (
              <div
                key={item.id}
                className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_72px_100px_100px_36px] sm:items-center sm:border-0 sm:p-0"
              >
                <div className="col-span-2 sm:col-span-1">
                  <Label className="mb-1 block text-xs sm:hidden">
                    Descripción
                  </Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                    placeholder="Diseño de sitio web"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs sm:hidden">Cant.</Label>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    className="text-right"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity:
                          e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs sm:hidden">Precio</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    className="text-right"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, {
                        price:
                          e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-end pr-1 text-sm font-medium tabular-nums">
                  {formatMoney(amount, invoice.currency)}
                </div>
                <div className="col-span-2 flex justify-end sm:col-span-1 sm:justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}
                    disabled={invoice.items.length === 1}
                    aria-label="Eliminar concepto"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="size-4" aria-hidden="true" />
          Añadir concepto
        </Button>
      </Section>

      <Section title="Notas">
        <Field label="Notas y condiciones de pago" htmlFor="notes">
          <Textarea
            id="notes"
            value={invoice.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Condiciones de pago, datos bancarios, agradecimientos…"
            rows={3}
          />
        </Field>
      </Section>
    </div>
  )
}
