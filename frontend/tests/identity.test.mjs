import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { distributors, stores } from '../src/data/organizations.js';
import { isValidAccount, nextUserId, normalizeEmail } from '../src/utils/identity.js';
import { validateRegistration } from '../src/utils/authValidation.js';

const basic = { role: 'client', name: 'Ana', email: 'ana@example.test', password: 'Clave1234', confirmPassword: 'Clave1234' };

test('demo identities and organization references are unique and valid', () => {
  assert.equal(demoUsers.length, 8);
  assert.equal(new Set(demoUsers.map(({ id }) => id)).size, 8);
  assert.equal(new Set(demoUsers.map(({ email }) => normalizeEmail(email))).size, 8);
  for (const user of demoUsers) {
    assert.equal(isValidAccount(user), true);
    if (user.storeId) assert.ok(stores.some(({ id }) => id === user.storeId));
    if (user.distributorId) assert.ok(distributors.some(({ id }) => id === user.distributorId));
  }
});

test('registration validates normalized email and client confirmation', () => {
  assert.deepEqual(validateRegistration(basic, demoUsers).errors, {});
  assert.equal(validateRegistration({ ...basic, email: ' CLIENTE@DEMO.TEST ' }, demoUsers).errors.email, 'Este correo ya está registrado.');
  assert.ok(validateRegistration({ ...basic, confirmPassword: 'other' }, demoUsers).errors.confirmPassword);
  assert.ok(validateRegistration({ ...basic, password: 'short' }, demoUsers).errors.password);
});

test('company codes and employee subroles belong to selected organizations and roles', () => {
  const store = { ...basic, role: 'store_employee', storeId: 's001', companyCode: ' tienda-central ', subRole: 'cashier' };
  assert.deepEqual(validateRegistration(store, demoUsers).errors, {});
  assert.ok(validateRegistration({ ...store, companyCode: 'TIENDA-NORTE' }, demoUsers).errors.companyCode);
  assert.ok(validateRegistration({ ...store, subRole: 'sales' }, demoUsers).errors.subRole);
  const distributor = { ...basic, role: 'distributor_employee', distributorId: 'd001', companyCode: 'DIST-ANDINAS', subRole: 'logistics' };
  assert.deepEqual(validateRegistration(distributor, demoUsers).errors, {});
  assert.ok(validateRegistration({ ...distributor, companyCode: '' }, demoUsers).errors.companyCode);
  assert.deepEqual(validateRegistration({ ...store, role: 'store_admin' }, demoUsers).errors, {});
});

test('registered IDs avoid both demo and registered IDs', () => {
  assert.equal(nextUserId([...demoUsers, { id: 'r001' }]), 'r002');
  assert.equal(nextUserId([...demoUsers, { id: 'r001' }, { id: 'r002' }]), 'r003');
});
