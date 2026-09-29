import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { prepareSaleTransaction } from '../src/utils/saleTransaction.js';

const before = () => ({ sales: [], storeInventory: [...storeInventory] });
const input = () => ({ storeId: 's001', lines: [{ productId: 'p001', quantity: 2 }],
  payments: [{ method: 'cash', amount: 17800 }], createdBy: 'u002', submittedAt: '2026-09-28T12:00:00.000Z' });
const prepare = (state, saleInput) => prepareSaleTransaction(state, saleInput, products, stores);

test('prepares immutable multi-line sale with exact split payments and one-store decrement', () => {
  const state = before();
  const result = prepare(state, { ...input(), lines: [
    { productId: 'p001', quantity: 2 }, { productId: 'p002', quantity: 1 }],
  payments: [{ method: 'card', amount: 17800 }, { method: 'nequi', amount: 8500 }] });
  assert.equal(result.sale.total, 26300);
  assert.deepEqual(result.sale.items, [
    { productId: 'p001', quantity: 2, unitPrice: 8900 },
    { productId: 'p002', quantity: 1, unitPrice: 8500 },
  ]);
  assert.equal(result.nextInventory.find(({ id }) => id === 'si001').quantity, 22);
  assert.equal(result.nextInventory.find(({ id }) => id === 'si002').quantity, 13);
  assert.equal(result.nextInventory.find(({ id }) => id === 'si016').quantity, 2);
  assert.equal(state.storeInventory.find(({ id }) => id === 'si001').quantity, 24);
});

test('invalid lines, stock, prices, dates, payment and record IDs fail without mutation', () => {
  const state = before();
  const cases = [
    [state, { ...input(), lines: [] }],
    [state, { ...input(), lines: [{ productId: 'p001', quantity: 0 }] }],
    [state, { ...input(), lines: [{ productId: 'p001', quantity: -1 }] }],
    [state, { ...input(), lines: [{ productId: 'p001', quantity: 1.5 }] }],
    [state, { ...input(), lines: [{ productId: 'p001', quantity: 25 }] }],
    [state, { ...input(), lines: [{ productId: 'p999', quantity: 1 }] }],
    [state, { ...input(), lines: [{ productId: 'p001', quantity: 1 }, { productId: 'p001', quantity: 1 }] }],
    [state, { ...input(), submittedAt: 'bad-date' }],
    [state, { ...input(), payments: [] }],
    [state, { ...input(), payments: [{ method: 'wire', amount: 17800 }] }],
    [state, { ...input(), payments: [{ method: 'cash', amount: 1 }] }],
    [state, { ...input(), payments: [{ method: 'cash', amount: -1 }] }],
    [state, { ...input(), payments: [{ method: 'cash', amount: Infinity }] }],
    [state, { ...input(), payments: [{ method: 'cash', amount: '17800' }] }],
    [{ ...state, sales: [{ id: 'sale001' }, { id: 'sale001' }] }, input()],
    [{ ...state, storeInventory: [...storeInventory, { ...storeInventory[0], id: 'si999' }] }, input()],
    [{ ...state, storeInventory: [...storeInventory, { ...storeInventory[0], storeId: 's002' }] }, input()],
    [{ ...state, storeInventory: storeInventory.map((item) => item.id === 'si001'
      ? { ...item, salePrice: -1 } : item) }, input()],
    [{ ...state, storeInventory: storeInventory.map((item) => item.id === 'si001'
      ? { ...item, quantity: 1 } : item) }, input()],
  ];
  for (const [current, saleInput] of cases) {
    const snapshot = structuredClone(current);
    assert.ok(prepare(current, saleInput).error);
    assert.deepEqual(current, snapshot);
  }
});

test('current price is snapshotted and payment must match it', () => {
  const state = { ...before(), storeInventory: storeInventory.map((item) => item.id === 'si001'
    ? { ...item, salePrice: 9500 } : item) };
  assert.ok(prepare(state, input()).error);
  const result = prepare(state, { ...input(), payments: [{ method: 'card', amount: 19000 }] });
  assert.equal(result.sale.total, 19000);
  assert.equal(result.sale.items[0].unitPrice, 9500);
});
