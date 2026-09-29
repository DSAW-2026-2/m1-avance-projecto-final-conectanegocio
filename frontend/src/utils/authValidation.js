import { distributors, stores } from '../data/organizations.js';
import { isDistributorRole, isEmployee, isStoreRole, normalizeCode, normalizeEmail, roles, subRoles } from './identity.js';

export function validateRegistration(input, users) {
  const errors = {};
  const name = String(input.name ?? '').trim();
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');
  if (!roles.includes(input.role)) errors.role = 'Selecciona un tipo de cuenta válido.';
  if (!name) errors.name = 'Escribe tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Escribe un correo válido.';
  else if (users.some((user) => normalizeEmail(user.email) === email)) errors.email = 'Este correo ya está registrado.';
  if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
    errors.password = 'Usa al menos 8 caracteres, una letra y un número.';
  }
  if (input.role === 'client' && password !== String(input.confirmPassword ?? '')) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }
  if (isStoreRole(input.role)) {
    const store = stores.find((item) => item.id === input.storeId);
    if (!store) errors.storeId = 'Selecciona una tienda válida.';
    if (!store || normalizeCode(input.companyCode) !== normalizeCode(store.companyCode)) errors.companyCode = 'El código no corresponde a la tienda.';
  }
  if (isDistributorRole(input.role)) {
    const distributor = distributors.find((item) => item.id === input.distributorId);
    if (!distributor) errors.distributorId = 'Selecciona un distribuidor válido.';
    if (!distributor || normalizeCode(input.companyCode) !== normalizeCode(distributor.companyCode)) errors.companyCode = 'El código no corresponde al distribuidor.';
  }
  if (isEmployee(input.role) && !subRoles[input.role].includes(input.subRole)) errors.subRole = 'Selecciona un subrol válido.';
  return { errors, values: { name, email, password } };
}
