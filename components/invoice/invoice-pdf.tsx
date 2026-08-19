'use client'

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { InvoiceData } from '@/lib/invoice-types'
import { computeTotals, formatDate, formatMoney } from '@/lib/invoice-utils'

const INK = '#1c2333'
const MUTED = '#6b7280'
const LINE = '#e5e7eb'
const SOFT = '#f6f7fb'

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: INK,
    lineHeight: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  logo: { width: 120, height: 48, objectFit: 'contain' },
  companyName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: INK },
  metaLine: { color: MUTED, fontSize: 9 },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: MUTED,
    textAlign: 'right',
    marginTop: 2,
  },
  datesBox: { marginTop: 12, alignItems: 'flex-end' },
  dateLabel: { color: MUTED, fontSize: 8, textTransform: 'uppercase' },
  dateValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  partiesRow: { flexDirection: 'row', gap: 16, marginBottom: 26 },
  partyCard: {
    flex: 1,
    backgroundColor: SOFT,
    borderRadius: 6,
    padding: 14,
  },
  partyLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 6,
  },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  partyText: { fontSize: 9, color: '#4b5563' },
  tableHead: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  th: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: MUTED,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  cDesc: { flex: 5 },
  cQty: { flex: 1.4, textAlign: 'right' },
  cPrice: { flex: 2, textAlign: 'right' },
  cAmount: { flex: 2, textAlign: 'right' },
  totals: { marginTop: 18, marginLeft: 'auto', width: 220 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: { color: MUTED },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 6,
  },
  grandLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  grandValue: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  notes: {
    marginTop: 34,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: LINE,
  },
  notesLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: MUTED,
    marginBottom: 4,
  },
  notesText: { fontSize: 9, color: '#4b5563' },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 44,
    right: 44,
    textAlign: 'center',
    color: MUTED,
    fontSize: 8,
    borderTopWidth: 1,
    borderColor: LINE,
    paddingTop: 8,
  },
})

export function InvoicePdf({ invoice }: { invoice: InvoiceData }) {
  const { subtotal, tax, total } = computeTotals(invoice)
  const accent = invoice.accentColor || '#2f4bd6'

  return (
    <Document
      title={`Factura ${invoice.invoiceNumber}`}
      author={invoice.companyName || 'Facturia'}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ maxWidth: 260 }}>
            {invoice.companyLogo ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={invoice.companyLogo} style={styles.logo} />
            ) : (
              <Text style={[styles.companyName, { color: accent }]}>
                {invoice.companyName || 'Tu empresa'}
              </Text>
            )}
            {invoice.companyLogo && invoice.companyName ? (
              <Text style={[styles.companyName, { marginTop: 8 }]}>
                {invoice.companyName}
              </Text>
            ) : null}
            {invoice.companyTaxId ? (
              <Text style={styles.metaLine}>NIF/CIF: {invoice.companyTaxId}</Text>
            ) : null}
            {invoice.companyAddress ? (
              <Text style={styles.metaLine}>{invoice.companyAddress}</Text>
            ) : null}
            {invoice.companyEmail ? (
              <Text style={styles.metaLine}>{invoice.companyEmail}</Text>
            ) : null}
            {invoice.companyPhone ? (
              <Text style={styles.metaLine}>{invoice.companyPhone}</Text>
            ) : null}
          </View>

          <View>
            <Text style={[styles.invoiceTitle, { color: accent }]}>FACTURA</Text>
            <Text style={styles.invoiceNumber}>
              {invoice.invoiceNumber || '—'}
            </Text>
            <View style={styles.datesBox}>
              <Text style={styles.dateLabel}>Fecha de emisión</Text>
              <Text style={styles.dateValue}>{formatDate(invoice.issueDate)}</Text>
              <Text style={styles.dateLabel}>Vencimiento</Text>
              <Text style={styles.dateValue}>{formatDate(invoice.dueDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyCard}>
            <Text style={styles.partyLabel}>Facturar a</Text>
            <Text style={styles.partyName}>
              {invoice.clientName || 'Nombre del cliente'}
            </Text>
            {invoice.clientTaxId ? (
              <Text style={styles.partyText}>NIF/CIF: {invoice.clientTaxId}</Text>
            ) : null}
            {invoice.clientAddress ? (
              <Text style={styles.partyText}>{invoice.clientAddress}</Text>
            ) : null}
            {invoice.clientEmail ? (
              <Text style={styles.partyText}>{invoice.clientEmail}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.cDesc]}>Descripción</Text>
          <Text style={[styles.th, styles.cQty]}>Cant.</Text>
          <Text style={[styles.th, styles.cPrice]}>Precio</Text>
          <Text style={[styles.th, styles.cAmount]}>Importe</Text>
        </View>

        {invoice.items.map((item) => {
          const amount = (Number(item.quantity) || 0) * (Number(item.price) || 0)
          return (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cDesc}>
                {item.description || 'Concepto sin descripción'}
              </Text>
              <Text style={styles.cQty}>{item.quantity}</Text>
              <Text style={styles.cPrice}>
                {formatMoney(Number(item.price) || 0, invoice.currency)}
              </Text>
              <Text style={styles.cAmount}>
                {formatMoney(amount, invoice.currency)}
              </Text>
            </View>
          )
        })}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text>{formatMoney(subtotal, invoice.currency)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              IVA ({Number(invoice.taxRate) || 0}%)
            </Text>
            <Text>{formatMoney(tax, invoice.currency)}</Text>
          </View>
          <View style={[styles.grandRow, { backgroundColor: accent }]}>
            <Text style={styles.grandLabel}>TOTAL</Text>
            <Text style={styles.grandValue}>
              {formatMoney(total, invoice.currency)}
            </Text>
          </View>
        </View>

        {invoice.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notas</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer} fixed>
          {invoice.companyName || 'Facturia'} · Factura{' '}
          {invoice.invoiceNumber} · {formatMoney(total, invoice.currency)}
        </Text>
      </Page>
    </Document>
  )
}
