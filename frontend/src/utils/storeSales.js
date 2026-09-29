import { storeSalesDestination } from '../routes/destinations.js';
import { isValidStoreId } from './catalog.js';
import { canAccess } from './permissions.js';
import { prepareSaleTransaction, validRecordIds } from './saleTransaction.js';

function failure(state, message, submissionId) {
  return { ...state, storeSaleNotice: { kind: 'error', message, submissionId } };
}

function sameAttempt(sale, user, input) {
  return sale.storeId === user.storeId && sale.createdBy === user.id &&
    Array.isArray(sale.items) && Array.isArray(input.lines) && sale.items.length === input.lines.length &&
    sale.items.every((line, index) => line.productId === input.lines[index]?.productId &&
      line.quantity === input.lines[index]?.quantity) &&
    Array.isArray(sale.payments) && Array.isArray(input.payments) && sale.payments.length === input.payments.length &&
    sale.payments.every((payment, index) => payment.method === input.payments[index]?.method &&
      payment.amount === input.payments[index]?.amount);
}

export function registerStoreSaleState(state, user, input, products, stores, submittedAt) {
  const submissionId = input?.submissionId;
  if (!canAccess(user, storeSalesDestination)) return failure(state, 'No tienes permiso para registrar ventas.', submissionId);
  if (!isValidStoreId(user.storeId, stores)) return failure(state, 'Tu tienda no está disponible.', submissionId);
  if (typeof input?.submissionId !== 'string' || !input.submissionId.trim()) {
    return failure(state, 'No se pudo identificar este intento de venta.', submissionId);
  }
  if (!validRecordIds(state?.sales)) return failure(state, 'Los registros de ventas son inconsistentes.', submissionId);
  const previous = state.sales.find(({ submissionId }) => submissionId === input.submissionId);
  if (previous) {
    if (!sameAttempt(previous, user, input)) return failure(state, 'Este intento ya se usó para otra venta.', submissionId);
    return { ...state, storeSaleNotice: { kind: 'success', message: 'Venta simulada ya registrada.',
      saleId: previous.id, submissionId } };
  }
  const prepared = prepareSaleTransaction(state, { storeId: user.storeId, lines: input?.lines,
    payments: input?.payments, createdBy: user.id, submittedAt,
    submissionId: input.submissionId }, products, stores);
  if (prepared.error) return failure(state, prepared.error, submissionId);
  return { ...state, sales: [...state.sales, prepared.sale], storeInventory: prepared.nextInventory,
    storeSaleNotice: { kind: 'success', message: 'Venta simulada registrada.',
      saleId: prepared.sale.id, submissionId } };
}

export function getStoreSaleHistory(sales, user, stores) {
  if (!canAccess(user, storeSalesDestination) || !isValidStoreId(user.storeId, stores) || !Array.isArray(sales)) {
    return [];
  }
  return sales.filter((sale) => sale?.storeId === user.storeId);
}
