import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';

test('catalog seeds are coherent and show store-specific differences', () => {
  const productIds = new Set(products.map(({ id }) => id));
  const storeIds = new Set(stores.map(({ id }) => id));
  const itemIds = new Set(storeInventory.map(({ id }) => id));
  const pairs = new Set(storeInventory.map(({ storeId, productId }) => `${storeId}:${productId}`));
  assert.ok(products.length >= 15 && products.length <= 20);
  assert.equal(productIds.size, products.length);
  assert.equal(itemIds.size, storeInventory.length);
  assert.equal(pairs.size, storeInventory.length);
  assert.ok(products.every(({ id, name, category, description, ...other }) =>
    id && name && category && description && Object.keys(other).length === 0));
  assert.ok(storeInventory.every((item) => storeIds.has(item.storeId) && productIds.has(item.productId)));
  assert.ok(storeInventory.every(({ quantity, minStock, salePrice, lastPurchasePrice }) =>
    [quantity, minStock, salePrice, lastPurchasePrice].every(Number.isFinite) &&
    Number.isInteger(quantity) && Number.isInteger(minStock) && quantity >= 0 && minStock >= 0 && salePrice >= 0));
  const central = storeInventory.filter(({ storeId }) => storeId === 's001');
  const north = storeInventory.filter(({ storeId }) => storeId === 's002');
  assert.ok(central.some((item) => north.some((other) => other.productId === item.productId &&
    other.salePrice !== item.salePrice && other.quantity !== item.quantity)));
  assert.ok(central.some((item) => !north.some((other) => other.productId === item.productId)));
  assert.ok(storeInventory.some(({ quantity }) => quantity === 0));
  assert.ok(storeInventory.some(({ quantity, minStock }) => quantity > 0 && quantity <= minStock));
});
