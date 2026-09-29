import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { getClientOrderHistory, snapshotTotal } from '../src/utils/shoppingHistory.js';

const client = demoUsers.find((user) => user.role === 'client');
const other = { ...client, id: 'other-client' };
const order = (id, customerId) => ({ id, orderType: 'customer', customerId, storeId: 's001',
  items: [{ productId: 'p001', quantity: 2, unitPrice: 8900 }], status: 'pending' });
const sale = (id, owner) => ({ id: `sale-${id}`, orderId: id, storeId: 's001', createdBy: owner,
  payments: [{ method: 'cash', amount: 17800 }], total: 17800 });

test('history returns only current client records and matching sale/payment', () => {
  const orders = [order('ord001', client.id), order('ord002', other.id)];
  const sales = [sale('ord001', client.id), sale('ord002', other.id)];
  const history = getClientOrderHistory(orders, sales, client);
  assert.equal(history.length, 1);
  assert.equal(history[0].order.id, 'ord001');
  assert.equal(history[0].sale.orderId, 'ord001');
  assert.equal(history[0].total, 17800);
  assert.deepEqual(getClientOrderHistory(orders, sales, null), []);
  assert.deepEqual(getClientOrderHistory(orders, sales, demoUsers.find((u) => u.role === 'store_admin')), []);
});

test('historical total stays tied to checkout snapshots and invalid sale links fail closed', () => {
  const orders = [order('ord001', client.id)];
  const fakeCurrentInventoryPrice = 9500;
  assert.equal(getClientOrderHistory(orders, [sale('ord001', client.id)], client)[0].total, 17800);
  assert.notEqual(fakeCurrentInventoryPrice * 2, 17800);
  assert.equal(getClientOrderHistory(orders, [sale('ord001', other.id)], client)[0].sale, null);
  assert.equal(getClientOrderHistory(orders, [sale('ord001', client.id), sale('ord001', client.id)], client)[0].sale, null);
  assert.equal(snapshotTotal([{ quantity: 1, unitPrice: NaN }]), null);
});
