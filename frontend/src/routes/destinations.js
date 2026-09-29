import { canAccess } from '../utils/permissions.js';

export const clientCartDestination = {
  path: '/client/cart', page: 'cart', requiresAuth: true, allowedRoles: ['client'], navigation: 'Mi carrito',
};

export const storeSalesDestination = {
  path: '/store/sales', page: 'storeSales', requiresAuth: true,
  allowedRoles: ['store_admin', 'store_employee'],
  allowedSubRoles: { store_employee: ['cashier'] }, navigation: 'Ventas',
};

export const destinations = [
  { path: '/', page: 'home', requiresAuth: false, navigation: 'Inicio' },
  { path: '/products', page: 'products', requiresAuth: false, navigation: 'Productos' },
  { path: '/products/:productId', page: 'productDetail', requiresAuth: false },
  { path: '/login', page: 'login', requiresAuth: false, navigation: 'Ingresar', accountEntry: true },
  { path: '/register', page: 'register', requiresAuth: false, navigation: 'Registrarse', accountEntry: true },
  { path: '/client/dashboard', page: 'dashboard', requiresAuth: true, allowedRoles: ['client'], navigation: 'Mi panel' },
  clientCartDestination,
  { path: '/client/orders', page: 'orders', requiresAuth: true, allowedRoles: ['client'], navigation: 'Mis pedidos' },
  { path: '/store/dashboard', page: 'dashboard', requiresAuth: true, allowedRoles: ['store_admin', 'store_employee'], navigation: 'Mi panel' },
  storeSalesDestination,
  { path: '/distributor/dashboard', page: 'dashboard', requiresAuth: true, allowedRoles: ['distributor_admin', 'distributor_employee'], navigation: 'Mi panel' },
];

export function visibleDestinations(user) {
  return destinations.filter((destination) => destination.navigation &&
    (!destination.accountEntry || !user) &&
    (!destination.requiresAuth || (user && canAccess(user, destination))));
}
