export function addInvoiceState(state, user, invoice) {
  if (!user || !['store_admin', 'store_employee'].includes(user.role) || !invoice?.id) {
    return { ...state, invoiceNotice: { kind: 'error', message: 'No se pudo guardar la factura.' } };
  }
  if (state.invoices.some(({ id }) => id === invoice.id)) return { ...state, invoiceNotice: { kind: 'success', message: 'Factura ya estaba guardada.' } };
  return { ...state, invoices: [...state.invoices, invoice], invoiceNotice: { kind: 'success', message: 'Factura guardada.' } };
}
