export function isValidStoreId(storeId, stores) {
  return stores.some((store) => store.id === storeId);
}

export function stockStatus({ quantity, minStock }) {
  if (quantity === 0) return 'out';
  return quantity <= minStock ? 'low' : 'available';
}

export function getStoreOffers(storeId, products, inventory, stores) {
  if (!isValidStoreId(storeId, stores)) return [];
  return inventory.filter((item) => item.storeId === storeId).flatMap((item) => {
    const product = products.find(({ id }) => id === item.productId);
    const matching = inventory.filter((candidate) =>
      candidate.storeId === storeId && candidate.productId === item.productId);
    return product && matching.length === 1
      ? [{ product, inventoryItem: item, availability: stockStatus(item) }]
      : [];
  });
}

export function getProductDetail(productId, storeId, products, inventory, stores) {
  const product = products.find(({ id }) => id === productId);
  if (!product) return { kind: 'not-found' };
  if (!isValidStoreId(storeId, stores)) return { kind: 'select-store', product };
  const offer = getStoreOffers(storeId, products, inventory, stores)
    .find((item) => item.product.id === productId);
  if (!offer) return { kind: 'not-sold', product };
  return { kind: 'offered', ...offer };
}

export function getCategories(offers) {
  return [...new Set(offers.map(({ product }) => product.category))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function filterOffers(offers, query, category) {
  const normalized = query.trim().toLocaleLowerCase('es');
  return offers.filter(({ product }) =>
    (!category || product.category === category) &&
    product.name.toLocaleLowerCase('es').includes(normalized));
}
