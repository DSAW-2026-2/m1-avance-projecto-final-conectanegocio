import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { saleDraftSummary, saleOptions } from '../src/utils/storeSaleDraft.js';

const summary = (lines, inventory = storeInventory) =>
  saleDraftSummary(lines, 's001', products, inventory, stores);

test('draft totals are derived from current own-store inventory, not stored or supplier prices', () => {
  const lines = [{ productId: 'p001', quantity: '2' }, { productId: 'p002', quantity: '1' }];
  assert.equal(summary(lines).total, 26300);
  const repriced = storeInventory.map((item) => item.id === 'si002' ? { ...item, salePrice: 9000 } : item);
  assert.equal(summary(lines, repriced).total, 26800);
  assert.equal(summary(lines, repriced).lines[1].unitPrice, 9000);
  assert.ok(!saleOptions('s001', products, storeInventory, stores).some(({ product }) => product.id === 'p006'));
  assert.ok(!saleOptions('s001', products, storeInventory, stores, lines).some(({ product }) => product.id === 'p001'));
});

test('invalid, exhausted and removed draft lines block a valid total without changing inventory', () => {
  for (const quantity of ['', '0', '-1', '1.5', '25']) {
    const result = summary([{ productId: 'p001', quantity }]);
    assert.equal(result.total, null);
    assert.ok(result.lines[0].problem);
  }
  const missing = summary([{ productId: 'p001', quantity: '1' }],
    storeInventory.filter(({ id }) => id !== 'si001'));
  assert.equal(missing.total, null);
  assert.ok(missing.lines[0].problem);
  const exhausted = summary([{ productId: 'p001', quantity: '1' }],
    storeInventory.map((item) => item.id === 'si001' ? { ...item, quantity: 0 } : item));
  assert.equal(exhausted.total, null);
  assert.match(exhausted.lines[0].problem, /0 unidades/);
  assert.equal(storeInventory.find(({ id }) => id === 'si001').quantity, 24);
});
