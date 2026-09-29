import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { createRegisteredAccount, findAccount } from '../src/utils/authService.js';

const client = { role: 'client', name: 'Ana', email: ' ANA@EXAMPLE.TEST ', password: 'Clave1234', confirmPassword: 'Clave1234' };

test('register creates minimal user, no code or confirmation retained', () => {
  const result = createRegisteredAccount(client, []);
  assert.equal(result.ok, true);
  assert.equal(result.user.email, 'ana@example.test');
  assert.equal(result.user.confirmPassword, undefined);
  assert.equal(result.user.companyCode, undefined);
  assert.ok(!demoUsers.some((user) => user.id === result.user.id));
  assert.equal(createRegisteredAccount({ ...client, email: ' ANA@EXAMPLE.TEST ' }, [result.user]).ok, false);
  const store = createRegisteredAccount({ ...client, role: 'store_employee', storeId: 's001', companyCode: 'TIENDA-CENTRAL', subRole: 'cashier' }, []);
  assert.equal(store.ok, true);
  assert.deepEqual([store.user.storeId, store.user.subRole, store.user.companyCode], ['s001', 'cashier', undefined]);
});

test('demo and registered login matches normalized email but exact password', () => {
  const registered = createRegisteredAccount(client, []).user;
  assert.equal(findAccount(' ANA@EXAMPLE.TEST ', 'Clave1234', [registered])?.id, registered.id);
  assert.equal(findAccount(demoUsers[0].email, demoUsers[0].password, [registered])?.id, demoUsers[0].id);
  assert.equal(findAccount(registered.email, 'wrong', [registered]), null);
});

test('every business role and employee subrole can register with only its own fields', () => {
  const cases = [
    ['store_admin', undefined, 's001', 'TIENDA-CENTRAL'],
    ['store_employee', 'cashier', 's001', 'TIENDA-CENTRAL'],
    ['store_employee', 'inventory', 's001', 'TIENDA-CENTRAL'],
    ['distributor_admin', undefined, 'd001', 'DIST-ANDINAS'],
    ['distributor_employee', 'sales', 'd001', 'DIST-ANDINAS'],
    ['distributor_employee', 'inventory', 'd001', 'DIST-ANDINAS'],
    ['distributor_employee', 'logistics', 'd001', 'DIST-ANDINAS'],
  ];
  for (const [role, subRole, organizationId, companyCode] of cases) {
    const input = { ...client, role, subRole, storeId: organizationId,
      distributorId: organizationId, companyCode, email: `${role}-${subRole ?? 'admin'}@example.test` };
    const result = createRegisteredAccount(input, []);
    assert.equal(result.ok, true, JSON.stringify(result.errors));
    assert.equal(result.user.subRole, subRole);
    assert.equal(result.user.companyCode, undefined);
    assert.equal(result.user.confirmPassword, undefined);
    assert.equal(result.user.storeId, role.startsWith('store_') ? organizationId : undefined);
    assert.equal(result.user.distributorId, role.startsWith('distributor_') ? organizationId : undefined);
  }
});
