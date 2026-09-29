import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { canAccess, getDashboardPath, isValidPolicy } from '../src/utils/permissions.js';

const [client, storeAdmin, cashier, storeInventory, distributorAdmin] = demoUsers;

test('all roles map to their own dashboard', () => {
  assert.deepEqual(demoUsers.map((user) => getDashboardPath(user.role)), [
    '/client/dashboard', '/store/dashboard', '/store/dashboard', '/store/dashboard',
    '/distributor/dashboard', '/distributor/dashboard', '/distributor/dashboard', '/distributor/dashboard',
  ]);
  assert.equal(getDashboardPath('unknown'), '/');
});

test('inventory-only policy denies cashier and grants admin only when listed', () => {
  const policy = { allowedRoles: ['store_employee'], allowedSubRoles: { store_employee: ['inventory'] } };
  assert.equal(canAccess(storeInventory, policy), true);
  assert.equal(canAccess(cashier, policy), false);
  assert.equal(canAccess(storeAdmin, policy), false);
  assert.equal(canAccess(storeAdmin, { ...policy, allowedRoles: ['store_admin', 'store_employee'] }), true);
  assert.equal(canAccess(client, policy), false);
});

test('invalid subrole and incomplete policy fail closed', () => {
  const policy = { allowedRoles: ['store_employee'], allowedSubRoles: { store_employee: ['inventory'] } };
  assert.equal(canAccess({ ...storeInventory, subRole: undefined }, policy), false);
  assert.equal(canAccess(storeInventory, { allowedRoles: ['store_employee'], allowedSubRoles: { distributor_employee: ['inventory'] } }), false);
  assert.equal(canAccess(storeInventory, { allowedRoles: ['store_employee'], allowedSubRoles: {} }), false);
  assert.equal(canAccess(storeInventory, { allowedRoles: ['store_employee'], allowedSubRoles: { store_employee: ['sales'] } }), false);
  assert.equal(canAccess(storeInventory, { allowedRoles: [] }), false);
  assert.equal(canAccess(distributorAdmin, { allowedRoles: ['store_employee'] }), false);
  assert.equal(isValidPolicy(policy), true);
  assert.equal(isValidPolicy({ allowedRoles: ['store_employee'], allowedSubRoles: { store_employee: [] } }), false);
});
