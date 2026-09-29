import { demoUsers } from '../data/demoUsers.js';
import { isDistributorRole, isEmployee, isStoreRole, nextUserId, normalizeEmail } from './identity.js';
import { validateRegistration } from './authValidation.js';

export function createRegisteredAccount(input, registeredUsers) {
  const allUsers = [...demoUsers, ...registeredUsers];
  const { errors, values } = validateRegistration(input, allUsers);
  if (Object.keys(errors).length) return { ok: false, errors };
  const user = {
    id: nextUserId(allUsers), ...values, role: input.role,
    ...(isStoreRole(input.role) ? { storeId: input.storeId } : {}),
    ...(isDistributorRole(input.role) ? { distributorId: input.distributorId } : {}),
    ...(isEmployee(input.role) ? { subRole: input.subRole } : {}),
  };
  return { ok: true, user };
}

export function findAccount(email, password, registeredUsers) {
  const normalized = normalizeEmail(email);
  return [...demoUsers, ...registeredUsers].find((user) =>
    normalizeEmail(user.email) === normalized && user.password === password) ?? null;
}
