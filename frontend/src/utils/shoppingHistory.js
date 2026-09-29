import { canShop } from './shoppingCart.js';

export function snapshotTotal(items) {
  if (!Array.isArray(items) || !items.length || !items.every(({ quantity, unitPrice }) =>
    Number.isInteger(quantity) && quantity > 0 && Number.isFinite(unitPrice) && unitPrice >= 0)) return null;
  const total = items.reduce((sum, { quantity, unitPrice }) => sum + quantity * unitPrice, 0);
  return Number.isFinite(total) ? total : null;
}

export function getClientOrderHistory(orders, sales, user) {
  if (!canShop(user) || !Array.isArray(orders) || !Array.isArray(sales)) return [];
  return orders.filter((order) => order.orderType === 'customer' && order.customerId === user.id)
    .map((order) => {
      const linked = sales.filter((sale) => sale.orderId === order.id &&
        sale.storeId === order.storeId && sale.createdBy === user.id);
      return { order, sale: linked.length === 1 ? linked[0] : null, total: snapshotTotal(order.items) };
    });
}
