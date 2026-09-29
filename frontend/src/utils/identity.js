import { stores, distributors } from '../data/organizations.js';

export const subRoles = {
  store_employee: ['cashier', 'inventory'],
  distributor_employee: ['sales', 'inventory', 'logistics'],
};
export const roles = ['client', 'store_admin', 'store_employee', 'distributor_admin', 'distributor_employee'];
export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();
export const normalizeCode = (code) => String(code ?? '').trim().toUpperCase();
export const isEmployee = (role) => Object.hasOwn(subRoles, role);
export const isStoreRole = (role) => role === 'store_admin' || role === 'store_employee';
export const isDistributorRole = (role) => role === 'distributor_admin' || role === 'distributor_employee';

export function isValidAccount(user) {
  if (!user || typeof user !== 'object' || Array.isArray(user)) return false;
  if (typeof user.id !== 'string' || !user.id.trim() || typeof user.name !== 'string' || !user.name.trim()) return false;
  if (typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(user.email))) return false;
  if (typeof user.password !== 'string' || !user.password || !roles.includes(user.role)) return false;
  if (isEmployee(user.role)) {
    if (!subRoles[user.role].includes(user.subRole)) return false;
  } else if (user.subRole != null) return false;
  if (isStoreRole(user.role)) return stores.some((store) => store.id === user.storeId) && user.distributorId == null;
  if (isDistributorRole(user.role)) return distributors.some((distributor) => distributor.id === user.distributorId) && user.storeId == null;
  return user.storeId == null && user.distributorId == null;
}

export function nextUserId(users) {
  const ids = new Set(users.map((user) => user.id));
  let number = 1;
  while (ids.has(`r${String(number).padStart(3, '0')}`)) number += 1;
  return `r${String(number).padStart(3, '0')}`;
}
