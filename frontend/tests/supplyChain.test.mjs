import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { distributors, stores } from '../src/data/organizations.js';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { supplierOffers } from '../src/data/supplierOffers.js';
import { createPurchaseOrderState, updateOrderStatusState } from '../src/utils/orderUtils.js';
import { getOffersForProduct, sortOffersByPrice } from '../src/utils/supplierUtils.js';
import { getPurchaseRecommendations, getSalesByPaymentMethod } from '../src/utils/reportUtils.js';

const admin = demoUsers.find(({ role }) => role === 'store_admin');
const distributor = demoUsers.find(({ role }) => role === 'distributor_admin');
const offer = supplierOffers[0];
const emptyState = { orders: [], sales: [], storeInventory: [...storeInventory] };

test('offers are comparable and sorted by transparent criteria', () => {
  const offers = getOffersForProduct('p001', supplierOffers, distributors);
  assert.equal(offers.length, 3);
  assert.equal(sortOffersByPrice(offers)[0].price, Math.min(...offers.map(({ price }) => price)));
});

test('store inventory user creates a pending supplier order', () => {
  const state = createPurchaseOrderState(emptyState, admin, { offerId: offer.id,
    productId: offer.productId, distributorId: offer.distributorId, quantity: 2 }, products, supplierOffers, '2026-09-28T12:00:00Z');
  assert.equal(state.orders[0].status, 'pending');
  assert.equal(state.orders[0].orderType, 'supplier');
});

test('distributor advances an order and delivery increases store inventory once', () => {
  const created = createPurchaseOrderState(emptyState, admin, { offerId: offer.id,
    productId: offer.productId, distributorId: offer.distributorId, quantity: 2 }, products, supplierOffers, '2026-09-28T12:00:00Z');
  let state = created;
  for (const status of ['confirmed', 'shipped', 'delivered']) state = updateOrderStatusState(state, distributor, state.orders[0].id, status, stores);
  const after = state.storeInventory.find(({ storeId, productId }) => storeId === admin.storeId && productId === offer.productId);
  assert.equal(after.quantity, storeInventory.find(({ storeId, productId }) => storeId === admin.storeId && productId === offer.productId).quantity + 2);
  const repeated = updateOrderStatusState(state, distributor, state.orders[0].id, 'delivered', stores);
  assert.equal(repeated.storeInventory.find(({ id }) => id === after.id).quantity, after.quantity);
});

test('report helpers derive payment totals and low-stock recommendations', () => {
  const sales = [{ total: 100, payments: [{ method: 'nequi', amount: 100 }], items: [] }];
  assert.deepEqual(getSalesByPaymentMethod(sales), { nequi: 100 });
  assert.equal(getPurchaseRecommendations(storeInventory, sales, products).some(({ product }) => product), true);
});
