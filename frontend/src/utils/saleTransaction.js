import { getProductDetail, isValidStoreId } from './catalog.js';

export const paymentMethods = ['cash', 'card', 'nequi'];

export function validRecordIds(records) {
  return Array.isArray(records) && records.every((record) =>
    record && typeof record.id === 'string' && record.id.trim()) &&
    new Set(records.map(({ id }) => id)).size === records.length;
}

export function nextRecordId(prefix, records) {
  if (!validRecordIds(records)) return null;
  const used = new Set(records.map(({ id }) => id));
  let number = 1;
  while (used.has(`${prefix}${String(number).padStart(3, '0')}`)) number += 1;
  return `${prefix}${String(number).padStart(3, '0')}`;
}

function invalid(message) {
  return { error: message };
}

export function prepareSaleTransaction(state, input, products, stores) {
  const { storeId, lines, payments, createdBy, submittedAt, orderId, submissionId } = input ?? {};
  if (!isValidStoreId(storeId, stores) || typeof createdBy !== 'string' || !createdBy.trim()) {
    return invalid('La tienda o el responsable de la venta no es válido.');
  }
  if (typeof submittedAt !== 'string' || Number.isNaN(Date.parse(submittedAt))) {
    return invalid('No se pudo registrar la fecha de la venta.');
  }
  if (!validRecordIds(state?.sales) || !validRecordIds(state?.storeInventory)) {
    return invalid('Los registros de ventas o existencias son inconsistentes.');
  }
  if (!Array.isArray(lines) || !lines.length || !lines.every((line) =>
    line && typeof line.productId === 'string' && line.productId.trim() &&
    Number.isInteger(line.quantity) && line.quantity > 0) ||
    new Set(lines.map((line) => line.productId)).size !== lines.length) {
    return invalid('Selecciona productos distintos con cantidades enteras mayores que cero.');
  }

  const offered = [];
  for (const line of lines) {
    const detail = getProductDetail(line.productId, storeId, products, state.storeInventory, stores);
    if (detail.kind !== 'offered') return invalid('Un producto ya no está disponible en esta tienda.');
    const item = detail.inventoryItem;
    if (!Number.isFinite(item.salePrice) || item.salePrice < 0 ||
        !Number.isInteger(item.quantity) || item.quantity < 0) {
      return invalid(`${detail.product.name}: precio o existencias inválidas.`);
    }
    if (item.quantity < line.quantity) return invalid(`${detail.product.name}: solo quedan ${item.quantity} unidades.`);
    offered.push({ item, productId: line.productId, quantity: line.quantity, unitPrice: item.salePrice });
  }
  const total = offered.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  if (!Number.isFinite(total) || total <= 0) return invalid('El total de la venta no es válido.');
  if (!Array.isArray(payments) || !payments.length || !payments.every((payment) =>
    payment && paymentMethods.includes(payment.method) &&
    typeof payment.amount === 'number' && Number.isFinite(payment.amount) && payment.amount > 0) ||
    payments.reduce((sum, payment) => sum + payment.amount, 0) !== total) {
    return invalid('Los pagos simulados deben ser válidos y sumar exactamente el total actual.');
  }
  const id = nextRecordId('sale', state.sales);
  if (!id) return invalid('No se pudo asignar un identificador único a la venta.');
  const items = offered.map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice }));
  const sale = { id, storeId, createdBy, date: submittedAt, items,
    payments: payments.map(({ method, amount }) => ({ method, amount })), total };
  if (orderId !== undefined) sale.orderId = orderId;
  if (submissionId !== undefined) sale.submissionId = submissionId;
  const quantities = new Map(offered.map(({ item, quantity }) => [item.id, quantity]));
  const nextInventory = state.storeInventory.map((item) => quantities.has(item.id)
    ? { ...item, quantity: item.quantity - quantities.get(item.id) } : item);
  return { sale, nextInventory };
}
