import { invoices } from '../data/invoices.js';

export function analyzeInvoice(file, stores, distributors, products) {
  const saved = invoices.find(({ fileName }) => fileName === file?.name) ?? invoices[0];
  return { ...saved, store: stores.find(({ id }) => id === saved.storeId),
    supplier: distributors.find(({ id }) => id === saved.supplierId),
    items: saved.items.map((item) => ({ ...item, product: products.find(({ id }) => id === item.productId) })) };
}
