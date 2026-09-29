import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { demoUsers } from '../src/data/demoUsers.js';
import { addCartItem } from '../src/utils/shoppingCart.js';
import { checkoutState } from '../src/utils/shoppingCheckout.js';
import { getStoreSaleHistory, registerStoreSaleState } from '../src/utils/storeSales.js';

const client = demoUsers.find(({ role }) => role === 'client');
const admin = demoUsers.find(({ role }) => role === 'store_admin');
const cashier = demoUsers.find(({ subRole }) => subRole === 'cashier');
const inventory = demoUsers.find(({ role, subRole }) => role === 'store_employee' && subRole === 'inventory');
const timestamp = '2026-09-28T12:00:00.000Z';

test('history joins client and counter sales but stays scoped to the assigned store', () => {
  const base = { selectedStoreId: 's001', storeInventory: [...storeInventory],
    cart: { customerId: null, storeId: null, items: [] }, orders: [], sales: [], shoppingNotice: null };
  const cart = addCartItem(base, client, 'p001', 1, products, stores);
  const checkedOut = checkoutState(cart, client, { paymentMethod: 'card' }, products, stores, timestamp);
  const counter = registerStoreSaleState(checkedOut, admin, {
    submissionId: 'counter-001', lines: [{ productId: 'p002', quantity: 1 }],
    payments: [{ method: 'cash', amount: 8500 }],
  }, products, stores, timestamp);
  const allSales = [...counter.sales, { ...counter.sales[0], id: 'sale999', storeId: 's002' }];
  for (const user of [admin, cashier]) {
    const history = getStoreSaleHistory(allSales, user, stores);
    assert.equal(history.length, 2);
    assert.ok(history.some((sale) => sale.orderId === checkedOut.orders[0].id));
    assert.ok(history.some((sale) => sale.submissionId === 'counter-001'));
    assert.ok(history.every(({ storeId }) => storeId === 's001'));
  }
  assert.deepEqual(getStoreSaleHistory(allSales, inventory, stores), []);
  assert.deepEqual(getStoreSaleHistory(allSales, client, stores), []);
  assert.deepEqual(getStoreSaleHistory(allSales, { ...cashier, storeId: 'missing' }, stores), []);
  assert.deepEqual(getStoreSaleHistory([], admin, stores), []);
});
