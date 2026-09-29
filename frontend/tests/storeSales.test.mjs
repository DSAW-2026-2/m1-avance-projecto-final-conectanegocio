import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { demoUsers } from '../src/data/demoUsers.js';
import { registerStoreSaleState } from '../src/utils/storeSales.js';

const admin = demoUsers.find(({ role }) => role === 'store_admin');
const cashier = demoUsers.find(({ subRole }) => subRole === 'cashier');
const timestamp = '2026-09-28T12:00:00.000Z';
const base = () => ({ selectedStoreId: 's002', storeInventory: [...storeInventory],
  cart: { customerId: 'u001', storeId: 's002', items: [{ productId: 'p001', quantity: 1 }] },
  orders: [{ id: 'ord001' }], sales: [], storeSaleNotice: null });
const input = (method = 'cash') => ({ lines: [{ productId: 'p001', quantity: 2 }],
  payments: [{ method, amount: 17800 }], submissionId: 'attempt-001' });
const submit = (state, saleInput = input(), user = admin) =>
  registerStoreSaleState(state, user, saleInput, products, stores, timestamp);
const business = ({ sales, orders, cart, storeInventory }) => ({ sales, orders, cart, storeInventory });

test('staff sale uses assigned store, records payment, and changes only matching inventory once', () => {
  for (const user of [admin, cashier]) {
    for (const method of ['cash', 'card', 'nequi']) {
      const before = base();
      const after = submit(before, input(method), user);
      assert.equal(after.sales.length, 1);
      assert.equal(after.sales[0].storeId, 's001');
      assert.equal(after.sales[0].createdBy, user.id);
      assert.equal(after.sales[0].orderId, undefined);
      assert.deepEqual(after.sales[0].payments, [{ method, amount: 17800 }]);
      assert.equal(after.storeInventory.find(({ id }) => id === 'si001').quantity, 22);
      assert.equal(after.storeInventory.find(({ id }) => id === 'si016').quantity, 2);
      assert.deepEqual(after.orders, before.orders);
      assert.deepEqual(after.cart, before.cart);
    }
  }
});

test('failed staff sale never changes business data', () => {
  const inventory = demoUsers.find(({ role, subRole }) => role === 'store_employee' && subRole === 'inventory');
  const before = base();
  const cases = [
    [before, input(), null], [before, input(), inventory],
    [before, input(), demoUsers.find(({ role }) => role === 'client')],
    [before, input(), { ...admin, storeId: 'missing' }],
    [before, { ...input(), lines: [] }, admin],
    [before, { ...input(), lines: [{ productId: 'p001', quantity: 0 }] }, admin],
    [before, { ...input(), payments: [{ method: 'cash', amount: 1 }] }, admin],
    [{ ...before, storeInventory: before.storeInventory.map((item) => item.id === 'si001'
      ? { ...item, quantity: 1 } : item) }, input(), admin],
    [{ ...before, storeInventory: before.storeInventory.map((item) => item.id === 'si001'
      ? { ...item, quantity: 0 } : item) }, input(), admin],
    [{ ...before, storeInventory: before.storeInventory.filter(({ id }) => id !== 'si001') }, input(), admin],
  ];
  for (const [state, saleInput, user] of cases) {
    const after = submit(state, saleInput, user);
    assert.equal(after.storeSaleNotice.kind, 'error');
    assert.deepEqual(business(after), business(state));
  }
});

test('multi-item and split payments use current store prices', () => {
  const before = base();
  const after = submit(before, { submissionId: 'attempt-001', lines: [
    { productId: 'p001', quantity: 2 }, { productId: 'p002', quantity: 1 }],
  payments: [{ method: 'cash', amount: 17800 }, { method: 'nequi', amount: 8500 }] });
  assert.equal(after.sales[0].total, 26300);
  assert.equal(after.sales[0].items.length, 2);
  assert.equal(after.storeInventory.find(({ id }) => id === 'si002').quantity, 13);
});

test('staff submission rechecks current price instead of trusting a displayed draft total', () => {
  const before = base();
  before.storeInventory = before.storeInventory.map((item) => item.id === 'si001'
    ? { ...item, salePrice: 9500 } : item);
  assert.deepEqual(business(submit(before)), business(before));
  const after = submit(before, { ...input(), payments: [{ method: 'card', amount: 19000 }] });
  assert.equal(after.sales[0].items[0].unitPrice, 9500);
  assert.equal(after.sales[0].total, 19000);
});

test('one submission ID is idempotent; a fresh ID permits another deliberate sale', () => {
  const first = submit(base());
  const repeated = submit(first);
  assert.equal(repeated.sales.length, 1);
  assert.deepEqual(repeated.storeInventory, first.storeInventory);
  assert.equal(repeated.storeSaleNotice.saleId, first.sales[0].id);
  const collision = submit(first, { ...input(), lines: [{ productId: 'p001', quantity: 1 }] });
  assert.equal(collision.storeSaleNotice.kind, 'error');
  assert.deepEqual(business(collision), business(first));
  const second = submit(first, { ...input(), submissionId: 'attempt-002' });
  assert.equal(second.sales.length, 2);
  assert.equal(second.storeInventory.find(({ id }) => id === 'si001').quantity, 20);
  assert.notEqual(second.sales[0].id, second.sales[1].id);
});
