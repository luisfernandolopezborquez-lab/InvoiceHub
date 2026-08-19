'use client'

import { createDefaultInvoice, type InvoiceData } from './invoice-types'

const STORAGE_KEY = 'facturia:invoice'

export function loadInvoice(): InvoiceData {
  const fallback = createDefaultInvoice()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<InvoiceData>
    // Fusiona con los valores por defecto para tolerar esquemas antiguos.
    return {
      ...fallback,
      ...parsed,
      items:
        Array.isArray(parsed.items) && parsed.items.length > 0
          ? parsed.items
          : fallback.items,
    }
  } catch {
    return fallback
  }
}

export function saveInvoice(invoice: InvoiceData): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice))
  } catch {
    // Ignora cuotas excedidas o modo privado.
  }
}
