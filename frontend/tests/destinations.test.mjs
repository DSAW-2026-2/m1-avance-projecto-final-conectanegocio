import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { destinations, visibleDestinations } from '../src/routes/destinations.js';
import { canAccess, isValidPolicy } from '../src/utils/permissions.js';
import { routeDecision } from '../src/utils/routeAccess.js';

test('only implemented destinations are in the central catalog', () => {
  assert.deepEqual(destinations.map(({ path }) => path), [
    '/', '/products', '/products/:productId', '/login', '/register',
    '/client/dashboard', '/client/cart', '/client/orders', '/store/dashboard', '/store/sales', '/store/suppliers',
    '/store/suppliers/:supplierId', '/store/purchase-orders', '/store/inventory', '/store/reports', '/store/invoices',
    '/store/chat', '/distributor/dashboard', '/distributor/orders', '/distributor/inventory', '/distributor/chat',
  ]);
  assert.equal(new Set(destinations.map(({ path }) => path)).size, destinations.length);
  assert.ok(destinations.filter(({ requiresAuth }) => requiresAuth).every(isValidPolicy));
});

test('store sales route and navigation admit only administrators and cashiers', () => {
  const route = destinations.find(({ path }) => path === '/store/sales');
  const admin = demoUsers.find(({ role }) => role === 'store_admin');
  const cashier = demoUsers.find(({ subRole }) => subRole === 'cashier');
  for (const user of [admin, cashier]) {
    assert.equal(routeDecision(user, route).kind, 'render');
    assert.ok(visibleDestinations(user).includes(route));
  }
  assert.deepEqual(routeDecision(null, route), { kind: 'redirect', to: '/login' });
  for (const user of demoUsers.filter((account) => account !== admin && account !== cashier)) {
    assert.equal(routeDecision(user, route).kind, 'redirect');
    assert.ok(!visibleDestinations(user).includes(route));
  }
});

test('navigation and route decisions read the same destination policies', () => {
  for (const user of demoUsers) {
    const shown = visibleDestinations(user).map(({ path }) => path);
    for (const destination of destinations.filter(({ requiresAuth, navigation }) => requiresAuth && navigation)) {
      assert.equal(shown.includes(destination.path), canAccess(user, destination));
    }
    assert.ok(!shown.includes('/login'));
    assert.ok(!shown.includes('/register'));
  }
  assert.ok(visibleDestinations(null).some(({ path }) => path === '/login'));
  assert.ok(!visibleDestinations(null).some(({ path }) => path === '/products/:productId'));
  assert.ok(!visibleDestinations(null).some(({ requiresAuth }) => requiresAuth));
});

test('client shopping routes protect direct URLs and hide non-client navigation', () => {
  const client = demoUsers.find((user) => user.role === 'client');
  const storeAdmin = demoUsers.find((user) => user.role === 'store_admin');
  for (const path of ['/client/cart', '/client/orders']) {
    const route = destinations.find((item) => item.path === path);
    assert.equal(routeDecision(client, route).kind, 'render');
    assert.deepEqual(routeDecision(null, route), { kind: 'redirect', to: '/login' });
    assert.deepEqual(routeDecision(storeAdmin, route), { kind: 'redirect', to: '/store/dashboard' });
    assert.ok(visibleDestinations(client).includes(route));
    assert.ok(!visibleDestinations(storeAdmin).includes(route));
  }
});
