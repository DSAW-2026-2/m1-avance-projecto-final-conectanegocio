import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { destinations } from '../src/routes/destinations.js';
import { routeDecision } from '../src/utils/routeAccess.js';

const clientDashboard = destinations.find(({ path }) => path === '/client/dashboard');
const storeDashboard = destinations.find(({ path }) => path === '/store/dashboard');

test('direct route access redirects signed-out and wrong-role users', () => {
  assert.deepEqual(routeDecision(null, storeDashboard), { kind: 'redirect', to: '/login' });
  assert.deepEqual(routeDecision(demoUsers[0], storeDashboard), { kind: 'redirect', to: '/client/dashboard' });
  assert.deepEqual(routeDecision(demoUsers[1], clientDashboard), { kind: 'redirect', to: '/store/dashboard' });
  assert.deepEqual(routeDecision(demoUsers[1], storeDashboard), { kind: 'render' });
});

test('unresolved or malformed policies never render a protected view or loop', () => {
  assert.deepEqual(routeDecision(demoUsers[0], null), { kind: 'unavailable' });
  assert.deepEqual(routeDecision(demoUsers[0], { ...clientDashboard, allowedRoles: [] }), { kind: 'unavailable' });
  assert.deepEqual(routeDecision(demoUsers[2], { ...storeDashboard, allowedSubRoles: { store_employee: ['inventory'] } }),
    { kind: 'unavailable' });
});

test('hypothetical subrole-restricted destination redirects cashier but admits inventory and explicit admin', () => {
  const destination = { path: '/store/inventory', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] } };
  assert.deepEqual(routeDecision(demoUsers[2], destination), { kind: 'redirect', to: '/store/dashboard' });
  assert.deepEqual(routeDecision(demoUsers[3], destination), { kind: 'render' });
  assert.deepEqual(routeDecision(demoUsers[1], destination), { kind: 'render' });
  assert.deepEqual(routeDecision(demoUsers[3], { ...destination, allowedSubRoles: {} }),
    { kind: 'redirect', to: '/store/dashboard' });
});
