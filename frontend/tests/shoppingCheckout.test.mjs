import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { demoUsers } from '../src/data/demoUsers.js';
import { addCartItem } from '../src/utils/shoppingCart.js';
import { checkoutState } from '../src/utils/shoppingCheckout.js';

const client = demoUsers.find((user) => user.role === 'client');
const storeAdmin = demoUsers.find((user) => user.role === 'store_admin');
const timestamp = '2026-09-28T12:00:00.000Z';
const base = () => ({ selectedStoreId: 's001', storeInventory: [...storeInventory],
  cart: { customerId: null, storeId: null, items: [] }, orders: [], sales: [], shoppingNotice: null });
const cartState = () => addCartItem(base(), client, 'p001', 2, products, stores);
const submit = (state, input = { paymentMethod: 'card' }, user = client, at = timestamp) =>
  checkoutState(state, user, input, products, stores, at);
const business = ({ cart, orders, sales, storeInventory }) => ({ cart, orders, sales, storeInventory });

test('checkout validates actor, cart, store, quantity and exact payment before business changes', () => {
  const state = cartState();
  const cases = [
    [state, null, storeAdmin],
    [base(), { paymentMethod: 'cash' }, client],
    [{ ...state, selectedStoreId: null }, { paymentMethod: 'cash' }, client],
    [{ ...state, selectedStoreId: 's002' }, { paymentMethod: 'cash' }, client],
    [{ ...state, cart: { ...state.cart, customerId: 'other' } }, { paymentMethod: 'cash' }, client],
    [{ ...state, cart: { ...state.cart, items: [{ productId: 'p001', quantity: 0 }] } }, { paymentMethod: 'cash' }, client],
    [{ ...state, cart: { ...state.cart, items: [{ productId: 'p001', quantity: 25 }] } }, { paymentMethod: 'cash' }, client],
    [{ ...state, cart: { ...state.cart, items: [{ productId: 'p001', quantity: 1 }, { productId: 'p001', quantity: 1 }] } }, { paymentMethod: 'cash' }, client],
    [{ ...state, cart: { ...state.cart, items: [null] } }, { paymentMethod: 'cash' }, client],
    [{ ...state, sales: [{ id: 'sale001' }, { id: 'sale001' }] }, { paymentMethod: 'cash' }, client],
    [state, {}, client], [state, { paymentMethod: 'other' }, client],
    [state, { paymentMethod: 'card', amount: 1 }, client],
  ];
  for (const [before, input, user] of cases) {
    const after = submit(before, input, user);
    assert.equal(after.shoppingNotice.kind, 'error');
    assert.deepEqual(business(after), business(before));
  }
});

test('stock drop, exhausted item, missing offer, conflicting offer and invalid prices cannot partially commit', () => {
  const state = cartState();
  const variations = [
    state.storeInventory.map((item) => item.id === 'si001' ? { ...item, quantity: 1 } : item),
    state.storeInventory.map((item) => item.id === 'si001' ? { ...item, quantity: 0 } : item),
    state.storeInventory.filter((item) => item.id !== 'si001'),
    [...state.storeInventory, { ...state.storeInventory[0], id: 'si999' }],
    state.storeInventory.map((item) => item.id === 'si001' ? { ...item, salePrice: -1 } : item),
  ];
  for (const inventory of variations) {
    const before = { ...state, storeInventory: inventory };
    const after = submit(before);
    assert.equal(after.shoppingNotice.kind, 'error');
    assert.deepEqual(business(after), business(before));
  }
  assert.deepEqual(business(submit(state, { paymentMethod: 'cash' }, client, 'bad-date')), business(state));
});

test('successful purchase creates linked order, sale, payment and one-store decrement atomically', () => {
  const before = cartState();
  for (const method of ['cash', 'card', 'nequi']) {
    const after = submit(before, { paymentMethod: method });
    assert.equal(after.shoppingNotice.kind, 'checkout-success');
    assert.equal(after.cart.items.length, 0);
    assert.equal(after.orders.length, 1);
    assert.equal(after.sales.length, 1);
    assert.equal(after.orders[0].orderType, 'customer');
    assert.equal(after.orders[0].status, 'pending');
    assert.equal(after.orders[0].customerId, client.id);
    assert.equal(after.orders[0].storeId, 's001');
    assert.equal(after.sales[0].orderId, after.orders[0].id);
    assert.deepEqual(after.sales[0].payments, [{ method, amount: 17800 }]);
    assert.equal(after.sales[0].total, 17800);
    assert.deepEqual(after.orders[0].items, [{ productId: 'p001', quantity: 2, unitPrice: 8900 }]);
    assert.equal(after.storeInventory.find(({ id }) => id === 'si001').quantity, 22);
    assert.equal(after.storeInventory.find(({ id }) => id === 'si016').quantity, 2);
    assert.equal(before.storeInventory.find(({ id }) => id === 'si001').quantity, 24);
  }
});

test('current price wins; queued/replayed submissions cannot create duplicates', () => {
  const before = cartState();
  const inventory = before.storeInventory.map((item) => item.id === 'si001' ? { ...item, salePrice: 9500 } : item);
  const repriced = submit({ ...before, storeInventory: inventory });
  assert.equal(repriced.sales[0].total, 19000);
  assert.equal(repriced.orders[0].items[0].unitPrice, 9500);
  const first = submit(before);
  const second = submit(first);
  assert.equal(second, first);
  assert.equal(second.orders.length, 1);
  assert.equal(second.sales.length, 1);
  assert.equal(submit(before).orders[0].id, first.orders[0].id);
  const nextPurchase = submit(addCartItem(first, client, 'p001', 1, products, stores));
  assert.notEqual(nextPurchase.orders[1].id, first.orders[0].id);
  assert.notEqual(nextPurchase.sales[1].id, first.sales[0].id);
});

test('shared sale preparation preserves multi-line client order linkage and current price', () => {
  const withSecond = addCartItem(cartState(), client, 'p002', 1, products, stores);
  const inventory = withSecond.storeInventory.map((item) => item.id === 'si002'
    ? { ...item, salePrice: 9000 } : item);
  const after = submit({ ...withSecond, storeInventory: inventory }, { paymentMethod: 'nequi' });
  assert.equal(after.orders.length, 1);
  assert.equal(after.sales.length, 1);
  assert.equal(after.sales[0].orderId, after.orders[0].id);
  assert.deepEqual(after.orders[0].items, after.sales[0].items);
  assert.equal(after.sales[0].items[1].unitPrice, 9000);
  assert.equal(after.sales[0].total, 26800);
  assert.equal(after.storeInventory.find(({ id }) => id === 'si002').quantity, 13);
  assert.equal(after.cart.items.length, 0);
});
