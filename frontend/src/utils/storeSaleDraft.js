import { getProductDetail, getStoreOffers } from './catalog.js';

export function saleOptions(storeId, products, inventory, stores, selected = []) {
  const used = new Set(selected.map(({ productId }) => productId));
  return getStoreOffers(storeId, products, inventory, stores).filter(({ product, inventoryItem }) =>
    !used.has(product.id) && Number.isInteger(inventoryItem.quantity) && inventoryItem.quantity > 0 &&
    Number.isFinite(inventoryItem.salePrice) && inventoryItem.salePrice >= 0);
}

export function saleDraftSummary(lines, storeId, products, inventory, stores) {
  const entries = lines.map(({ productId, quantity }) => {
    const detail = getProductDetail(productId, storeId, products, inventory, stores);
    const item = detail.kind === 'offered' ? detail.inventoryItem : null;
    const number = Number(quantity);
    const price = item?.salePrice;
    const validPrice = Number.isFinite(price) && price >= 0;
    const validStock = Number.isInteger(item?.quantity) && item.quantity >= 0;
    const validQuantity = String(quantity).trim() !== '' && Number.isInteger(number) && number > 0;
    const problem = !item ? 'Producto ya no disponible en esta tienda.'
      : !validPrice || !validStock ? 'Precio o existencias inválidas.'
        : !validQuantity ? 'Indica una cantidad entera mayor que cero.'
          : item.quantity < number ? `Solo quedan ${item.quantity} unidades.` : null;
    return { productId, name: detail.product?.name ?? 'Producto no disponible', quantity,
      unitPrice: validPrice ? price : null, subtotal: validPrice && validQuantity ? price * number : null, problem };
  });
  const total = entries.length && entries.every(({ problem }) => !problem)
    ? entries.reduce((sum, { subtotal }) => sum + subtotal, 0) : null;
  return { lines: entries, total: Number.isFinite(total) && total > 0 ? total : null };
}
