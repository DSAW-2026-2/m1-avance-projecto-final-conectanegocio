import test from 'node:test';
import assert from 'node:assert/strict';
import { demoUsers } from '../src/data/demoUsers.js';
import { AUTH_KEYS, loadAuthState, saveRegisteredUsers, saveSession } from '../src/utils/authStorage.js';

const account = { id: 'r001', name: 'Ana', email: 'ana@example.test', password: 'Clave1234', role: 'client' };
function storage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
const saved = (users, session) => storage({ [AUTH_KEYS.users]: JSON.stringify(users), [AUTH_KEYS.session]: session });

test('valid accounts and sessions recover; stale and malformed state signs out', () => {
  assert.equal(loadAuthState(saved([account], account.id)).currentUserId, account.id);
  assert.equal(loadAuthState(saved([account], 'missing')).currentUserId, null);
  const malformed = loadAuthState(storage({ [AUTH_KEYS.users]: '{broken', [AUTH_KEYS.session]: demoUsers[0].id }));
  assert.deepEqual(malformed.registeredUsers, []);
  assert.equal(malformed.currentUserId, null);
  assert.equal(malformed.persistenceAvailable, true);
  assert.equal(loadAuthState(storage({ [AUTH_KEYS.users]: '{}', [AUTH_KEYS.session]: demoUsers[0].id })).currentUserId, null);
});

test('demo collisions and persisted duplicate IDs/emails are discarded with sessions', () => {
  const demoCollision = { ...account, id: demoUsers[0].id, email: 'other@example.test' };
  assert.equal(loadAuthState(saved([demoCollision, account], demoUsers[0].id)).currentUserId, null);
  assert.deepEqual(loadAuthState(saved([demoCollision, account], demoUsers[0].id)).registeredUsers, [account]);
  const emailCollision = { ...account, id: 'r002', email: demoUsers[0].email.toUpperCase() };
  assert.deepEqual(loadAuthState(saved([emailCollision, account], 'r002')).registeredUsers, [account]);
  const duplicate = { ...account, id: 'r002' };
  assert.deepEqual(loadAuthState(saved([account, duplicate], account.id)).registeredUsers, []);
  assert.equal(loadAuthState(saved([account, duplicate], account.id)).currentUserId, null);
  const duplicateId = { ...account, email: 'other@example.test' };
  assert.deepEqual(loadAuthState(saved([account, duplicateId], account.id)).registeredUsers, []);
});

test('unavailable storage does not crash writes or reads', () => {
  const broken = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.equal(loadAuthState(broken).persistenceAvailable, false);
  assert.equal(saveRegisteredUsers([account], broken), false);
  assert.equal(saveSession(account.id, broken), false);
  const memory = storage();
  assert.equal(saveRegisteredUsers([account], memory), true);
  assert.equal(saveSession(account.id, memory), true);
  assert.equal(loadAuthState(memory).currentUserId, account.id);
  assert.equal(saveSession(null, memory), true);
  assert.equal(loadAuthState(memory).currentUserId, null);
});
