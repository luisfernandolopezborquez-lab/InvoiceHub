export type LineItem = {
  id: string
  description: string
  quantity: number
  price: number
}

export type InvoiceData = {
  // Empresa (emisor)
  companyName: string
  companyLogo: string | null // data URL
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyTaxId: string
  // Cliente (receptor)
  clientName: string
  clientEmail: string
  clientAddress: string
  clientTaxId: string
  // Factura
  invoiceNumber: string
  issueDate: string
  dueDate: string
  currency: string
  items: LineItem[]
  taxRate: number // porcentaje, p. ej. 21
  notes: string
  accentColor: string
}

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: 'EUR', symbol: '\u20AC', label: 'Euro (EUR)' },
  { code: 'USD', symbol: '$', label: 'Dólar (USD)' },
  { code: 'MXN', symbol: '$', label: 'Peso mexicano (MXN)' },
  { code: 'GBP', symbol: '\u00A3', label: 'Libra (GBP)' },
  { code: 'ARS', symbol: '$', label: 'Peso argentino (ARS)' },
  { code: 'COP', symbol: '$', label: 'Peso colombiano (COP)' },
]

export function createEmptyItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    price: 0,
  }
}

export function createDefaultInvoice(): InvoiceData {
  const today = new Date()
  const due = new Date()
  due.setDate(due.getDate() + 15)
  const toISO = (d: Date) => d.toISOString().slice(0, 10)

  return {
    companyName: '',
    companyLogo: null,
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyTaxId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientTaxId: '',
    invoiceNumber: `FAC-${today.getFullYear()}-001`,
    issueDate: toISO(today),
    dueDate: toISO(due),
    currency: 'EUR',
    items: [
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        price: 0,
      },
    ],
    taxRate: 21,
    notes: 'Gracias por su confianza. Pago mediante transferencia bancaria.',
    accentColor: '#2f4bd6',
  }
}
