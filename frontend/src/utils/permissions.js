import { isEmployee, isValidAccount, roles, subRoles } from './identity.js';

const dashboardPaths = {
  client: '/client/dashboard',
  store_admin: '/store/dashboard',
  store_employee: '/store/dashboard',
  distributor_admin: '/distributor/dashboard',
  distributor_employee: '/distributor/dashboard',
};

export function getDashboardPath(role) {
  return dashboardPaths[role] ?? '/';
}

export function isValidPolicy(policy) {
  if (!policy || typeof policy !== 'object' || !Array.isArray(policy.allowedRoles)) return false;
  if (!policy.allowedRoles.length || new Set(policy.allowedRoles).size !== policy.allowedRoles.length) return false;
  if (!policy.allowedRoles.every((role) => roles.includes(role))) return false;
  if (policy.allowedSubRoles === undefined) return true;
  const filters = policy.allowedSubRoles;
  if (!filters || typeof filters !== 'object' || Array.isArray(filters) || !Object.keys(filters).length) return false;
  return Object.entries(filters).every(([role, allowed]) =>
    isEmployee(role) && policy.allowedRoles.includes(role) &&
    Array.isArray(allowed) && allowed.length > 0 &&
    new Set(allowed).size === allowed.length &&
    allowed.every((subRole) => subRoles[role].includes(subRole)));
}

export function canAccess(user, policy) {
  if (!isValidAccount(user) || !isValidPolicy(policy)) return false;
  if (!policy.allowedRoles.includes(user.role)) return false;
  if (!isEmployee(user.role) || policy.allowedSubRoles === undefined) return true;
  return policy.allowedSubRoles[user.role]?.includes(user.subRole) === true;
}
