import { demoUsers } from '../data/demoUsers.js';
import { isValidAccount, normalizeEmail } from './identity.js';

export const AUTH_KEYS = {
  users: 'cn-react-auth-v1:registeredUsers',
  session: 'cn-react-auth-v1:currentUserId',
};

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

export function loadAuthState(storage = browserStorage()) {
  if (!storage) return { registeredUsers: [], currentUserId: null, persistenceAvailable: false };
  try {
    const raw = storage.getItem(AUTH_KEYS.users);
    const savedId = storage.getItem(AUTH_KEYS.session);
    let parsed;
    try { parsed = raw === null ? [] : JSON.parse(raw); }
    catch { return { registeredUsers: [], currentUserId: null, persistenceAvailable: true }; }
    if (!Array.isArray(parsed)) return { registeredUsers: [], currentUserId: null, persistenceAvailable: true };
    const candidates = parsed.filter(isValidAccount).map((user) => ({ ...user, email: normalizeEmail(user.email) }));
    const conflictedIds = new Set();
    for (const user of candidates) {
      const matches = candidates.filter((other) => other !== user &&
        (other.id === user.id || normalizeEmail(other.email) === normalizeEmail(user.email)));
      if (matches.length || demoUsers.some((demo) => demo.id === user.id || normalizeEmail(demo.email) === normalizeEmail(user.email))) {
        conflictedIds.add(user.id);
        matches.forEach((match) => conflictedIds.add(match.id));
      }
    }
    const registeredUsers = candidates.filter((user) => !conflictedIds.has(user.id) &&
      !demoUsers.some((demo) => demo.id === user.id || normalizeEmail(demo.email) === normalizeEmail(user.email)));
    const allUsers = [...demoUsers, ...registeredUsers];
    const currentUserId = savedId && !conflictedIds.has(savedId) && allUsers.filter((user) => user.id === savedId).length === 1
      ? savedId : null;
    return { registeredUsers, currentUserId, persistenceAvailable: true };
  } catch {
    return { registeredUsers: [], currentUserId: null, persistenceAvailable: false };
  }
}

export function saveRegisteredUsers(users, storage = browserStorage()) {
  try { storage.setItem(AUTH_KEYS.users, JSON.stringify(users)); return true; } catch { return false; }
}

export function saveSession(id, storage = browserStorage()) {
  try {
    if (id) storage.setItem(AUTH_KEYS.session, id);
    else storage.removeItem(AUTH_KEYS.session);
    return true;
  } catch { return false; }
}
