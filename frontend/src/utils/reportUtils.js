export const getTotalRevenue = (sales) => sales.reduce((total, sale) => total + sale.total, 0);
export const getNumberOfSales = (sales) => sales.length;

export function getGrossProfit(sales) {
  return sales.reduce((total, sale) => total + sale.items.reduce((sum, item) =>
    sum + ((item.unitPrice - (item.unitCost ?? 0)) * item.quantity), 0), 0);
}

export function getSalesByPaymentMethod(sales) {
  return sales.flatMap(({ payments }) => payments).reduce((summary, payment) => ({
    ...summary, [payment.method]: (summary[payment.method] ?? 0) + payment.amount,
  }), {});
}

export function getTopSellingProducts(sales, products) {
  const totals = sales.flatMap(({ items }) => items).reduce((summary, item) => ({
    ...summary, [item.productId]: (summary[item.productId] ?? 0) + item.quantity,
  }), {});
  return Object.entries(totals).map(([productId, quantity]) => ({
    product: products.find(({ id }) => id === productId), quantity,
  })).filter(({ product }) => product).sort((a, b) => b.quantity - a.quantity);
}

export const getLowStockProducts = (inventory, products) => inventory.filter(({ quantity, minStock }) => quantity <= minStock)
  .map((entry) => ({ ...entry, product: products.find(({ id }) => id === entry.productId) }))
  .filter(({ product }) => product);

export function getPurchaseRecommendations(inventory, sales, products) {
  const sold = getTopSellingProducts(sales, products);
  return getLowStockProducts(inventory, products).map((entry) => ({ ...entry,
    priority: sold.find(({ product }) => product.id === entry.productId) ? 'Alta' : 'Media' }));
}

export const getSupplierSpending = (orders) => orders.filter(({ orderType }) => orderType === 'supplier')
  .reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), 0);
