import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { filterOffers, getCategories, getProductDetail, getStoreOffers, isValidStoreId, stockStatus } from '../src/utils/catalog.js';

test('store selection accepts known stores and rejects unknown IDs', () => {
  assert.equal(isValidStoreId('s001', stores), true);
  assert.equal(isValidStoreId('s002', stores), true);
  assert.equal(isValidStoreId('unknown', stores), false);
  assert.equal(isValidStoreId(null, stores), false);
});

test('offers join one store only, preserving its retail price and stock', () => {
  const central = getStoreOffers('s001', products, storeInventory, stores);
  const north = getStoreOffers('s002', products, storeInventory, stores);
  assert.equal(central.find(({ product }) => product.id === 'p001').inventoryItem.salePrice, 8900);
  assert.equal(north.find(({ product }) => product.id === 'p001').inventoryItem.salePrice, 9500);
  assert.equal(central.find(({ product }) => product.id === 'p001').inventoryItem.quantity, 24);
  assert.equal(north.find(({ product }) => product.id === 'p001').inventoryItem.quantity, 2);
  assert.equal(north.some(({ product }) => product.id === 'p002'), false);
  assert.deepEqual(getStoreOffers('unknown', products, storeInventory, stores), []);
  assert.deepEqual(getStoreOffers('s001', products, [], stores), []);
});

test('detail distinguishes invalid product, no store, not sold and zero stock', () => {
  assert.equal(getProductDetail('missing', 's001', products, storeInventory, stores).kind, 'not-found');
  assert.equal(getProductDetail('p001', null, products, storeInventory, stores).kind, 'select-store');
  assert.equal(getProductDetail('p002', 's002', products, storeInventory, stores).kind, 'not-sold');
  assert.equal(getProductDetail('p006', 's001', products, storeInventory, stores).availability, 'out');
});

test('availability thresholds and pure combined filters', () => {
  assert.equal(stockStatus({ quantity: 0, minStock: 0 }), 'out');
  assert.equal(stockStatus({ quantity: 3, minStock: 3 }), 'low');
  assert.equal(stockStatus({ quantity: 4, minStock: 3 }), 'available');
  const offers = getStoreOffers('s001', products, storeInventory, stores);
  assert.ok(getCategories(offers).includes('Cuadernos'));
  assert.deepEqual(filterOffers(offers, '  CUADERNO ', 'Cuadernos').map(({ product }) => product.id), ['p001', 'p002']);
  assert.deepEqual(filterOffers(offers, 'cuaderno', 'Arte'), []);
  assert.deepEqual(filterOffers(offers, 'no-existe', ''), []);
});

test('ambiguous duplicate inventory offers are not shown', () => {
  const duplicate = [...storeInventory, { ...storeInventory[0], id: 'si999' }];
  assert.equal(getStoreOffers('s001', products, duplicate, stores).some(({ product }) => product.id === 'p001'), false);
});
