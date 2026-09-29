import { canAccess } from './permissions.js';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
export const orderStatuses = statuses;

function nextId(prefix, records) {
  let number = records.length + 1;
  while (records.some(({ id }) => id === `${prefix}${String(number).padStart(3, '0')}`)) number += 1;
  return `${prefix}${String(number).padStart(3, '0')}`;
}

export function createPurchaseOrderState(state, user, input, products, offers, submittedAt) {
  if (!canAccess(user, { allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] } })) {
    return { ...state, supplyNotice: { kind: 'error', message: 'No tienes permiso para crear pedidos.' } };
  }
  const offer = offers.find(({ id, distributorId }) => id === input?.offerId && distributorId === input.distributorId);
  const product = products.find(({ id }) => id === input?.productId);
  const quantity = Number(input?.quantity);
  if (!offer || !product || !Number.isInteger(quantity) || quantity < 1 || quantity > offer.stock) {
    return { ...state, supplyNotice: { kind: 'error', message: 'Selecciona una oferta y cantidad válida.' } };
  }
  const order = { id: nextId('ord', state.orders), orderType: 'supplier', storeId: user.storeId,
    distributorId: input.distributorId, items: [{ productId: product.id, quantity, unitPrice: offer.price }],
    status: 'pending', createdBy: user.id, createdAt: submittedAt };
  return { ...state, orders: [...state.orders, order], supplyNotice: { kind: 'success', message: 'Pedido creado.', orderId: order.id } };
}

export function updateOrderStatusState(state, user, orderId, nextStatus, stores) {
  const order = state.orders.find(({ id }) => id === orderId);
  const allowed = user?.role === 'distributor_admin' || user?.role === 'distributor_employee';
  if (!allowed || !order || order.orderType !== 'supplier' || order.distributorId !== user.distributorId ||
      !statuses.includes(nextStatus)) return { ...state, supplyNotice: { kind: 'error', message: 'No se pudo actualizar el pedido.' } };
  const currentIndex = statuses.indexOf(order.status);
  if (statuses.indexOf(nextStatus) !== currentIndex + 1 && nextStatus !== order.status) {
    return { ...state, supplyNotice: { kind: 'error', message: 'El pedido debe avanzar en orden.' } };
  }
  const orders = state.orders.map((item) => item.id === orderId ? { ...item, status: nextStatus } : item);
  if (nextStatus !== 'delivered' || order.status === 'delivered') return { ...state, orders };
  const inventory = state.storeInventory.map((entry) => {
    const line = order.items.find(({ productId }) => productId === entry.productId);
    return line && entry.storeId === order.storeId ? { ...entry, quantity: entry.quantity + line.quantity } : entry;
  });
  return { ...state, orders, storeInventory: inventory, supplyNotice: { kind: 'success', message: 'Pedido entregado e inventario actualizado.' } };
}

export function orderStatusLabel(status) {
  return { pending: 'Pendiente', confirmed: 'Confirmado', shipped: 'Enviado', delivered: 'Entregado' }[status] ?? status;
}
