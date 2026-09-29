import { cartSummary, canShop, emptyCart } from './shoppingCart.js';
import { isValidStoreId } from './catalog.js';
import { nextRecordId, paymentMethods, prepareSaleTransaction, validRecordIds } from './saleTransaction.js';

export { paymentMethods };

function failure(state, message) {
  return { ...state, shoppingNotice: { kind: 'error', message } };
}

export function checkoutState(state, user, input, products, stores, submittedAt) {
  if (!canShop(user)) return failure(state, 'Solo un cliente puede comprar.');
  if (!Array.isArray(state.orders) || !Array.isArray(state.sales) || !Array.isArray(state.storeInventory)) {
    return failure(state, 'No se puede completar una compra con datos inconsistentes.');
  }
  if (!validRecordIds(state.orders) || !validRecordIds(state.sales)) {
    return failure(state, 'No se puede crear un pedido o venta con registros inconsistentes.');
  }
  const { cart, selectedStoreId } = state;
  if (!cart || !Array.isArray(cart.items)) return failure(state, 'El carrito contiene datos inválidos.');
  if (!cart.items.length) {
    return state.shoppingNotice?.kind === 'checkout-success' ? state : failure(state, 'Tu carrito está vacío.');
  }
  if (cart.customerId !== user.id || !isValidStoreId(selectedStoreId, stores) || cart.storeId !== selectedStoreId) {
    return failure(state, 'El carrito no corresponde a tu cuenta o a la tienda seleccionada.');
  }
  if (!cart.items.every((line) => line && typeof line.productId === 'string' && line.productId.length > 0) ||
      new Set(cart.items.map(({ productId }) => productId)).size !== cart.items.length) {
    return failure(state, 'El carrito contiene productos duplicados o inválidos.');
  }
  const summary = cartSummary(cart, state.storeInventory, products, stores);
  if (summary.lines.some((line) => !line.product || !Number.isInteger(line.quantity) || line.quantity < 1)) {
    return failure(state, 'Corrige las cantidades o productos inválidos del carrito.');
  }
  const unavailable = summary.lines.find((line) => line.problem);
  if (unavailable) return failure(state, `${unavailable.product?.name ?? 'Producto'}: ${unavailable.problem}`);
  if (!Number.isFinite(summary.total) || summary.total <= 0) {
    return failure(state, 'El total de esta compra no es válido.');
  }
  if (!input || !paymentMethods.includes(input.paymentMethod) ||
      (Object.hasOwn(input, 'amount') && input.amount !== summary.total)) {
    return failure(state, 'Selecciona un medio de pago válido para el total actual.');
  }
  if (typeof submittedAt !== 'string' || Number.isNaN(Date.parse(submittedAt))) {
    return failure(state, 'No se pudo registrar la fecha de la compra.');
  }

  const orderId = nextRecordId('ord', state.orders);
  if (!orderId) return failure(state, 'No se pudo asignar un identificador al pedido.');
  const prepared = prepareSaleTransaction(state, { storeId: selectedStoreId, lines: cart.items,
    payments: [{ method: input.paymentMethod, amount: summary.total }], createdBy: user.id,
    submittedAt, orderId }, products, stores);
  if (prepared.error) return failure(state, prepared.error);
  const { sale, nextInventory } = prepared;
  const items = sale.items.map((line) => ({ ...line }));
  const order = { id: orderId, orderType: 'customer', storeId: selectedStoreId,
    customerId: user.id, items, status: 'pending', createdBy: user.id, createdAt: submittedAt };

  return { ...state, orders: [...state.orders, order], sales: [...state.sales, sale],
    storeInventory: nextInventory, cart: emptyCart(),
    shoppingNotice: { kind: 'checkout-success', message: 'Compra simulada registrada.', orderId } };
}
