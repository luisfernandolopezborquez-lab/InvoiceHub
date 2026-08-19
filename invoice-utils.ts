import { CURRENCIES, type InvoiceData } from './invoice-types'

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code
}

export function computeTotals(invoice: InvoiceData) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  )
  const taxRate = Number(invoice.taxRate) || 0
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax
  return { subtotal, tax, total }
}

export function formatMoney(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
  return `${symbol}${formatted}`
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}
