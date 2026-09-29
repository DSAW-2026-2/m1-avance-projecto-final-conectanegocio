import { canAccess } from '../utils/permissions.js';

export const clientCartDestination = {
  path: '/client/cart', page: 'cart', requiresAuth: true, allowedRoles: ['client'], navigation: 'Mi carrito',
};

export const storeSalesDestination = {
  path: '/store/sales', page: 'storeSales', requiresAuth: true,
  allowedRoles: ['store_admin', 'store_employee'],
  allowedSubRoles: { store_employee: ['cashier'] }, navigation: 'Ventas',
};

export const storeSupplyDestination = {
  path: '/store/suppliers', page: 'suppliers', requiresAuth: true,
  allowedRoles: ['store_admin', 'store_employee'],
  allowedSubRoles: { store_employee: ['inventory'] }, navigation: 'Proveedores',
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
  storeSupplyDestination,
  { path: '/store/suppliers/:supplierId', page: 'supplierDetail', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] } },
  { path: '/store/purchase-orders', page: 'purchaseOrders', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] }, navigation: 'Pedidos' },
  { path: '/store/inventory', page: 'storeInventory', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], navigation: 'Inventario' },
  { path: '/store/reports', page: 'reports', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] }, navigation: 'Reportes' },
  { path: '/store/invoices', page: 'invoices', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], allowedSubRoles: { store_employee: ['inventory'] }, navigation: 'Facturas' },
  { path: '/store/chat', page: 'chat', requiresAuth: true,
    allowedRoles: ['store_admin', 'store_employee'], navigation: 'Chat' },
  { path: '/distributor/dashboard', page: 'dashboard', requiresAuth: true, allowedRoles: ['distributor_admin', 'distributor_employee'], navigation: 'Mi panel' },
  { path: '/distributor/orders', page: 'distributorOrders', requiresAuth: true,
    allowedRoles: ['distributor_admin', 'distributor_employee'], navigation: 'Pedidos recibidos' },
  { path: '/distributor/inventory', page: 'distributorInventory', requiresAuth: true,
    allowedRoles: ['distributor_admin', 'distributor_employee'], navigation: 'Mi catálogo' },
  { path: '/distributor/chat', page: 'chat', requiresAuth: true,
    allowedRoles: ['distributor_admin', 'distributor_employee'], navigation: 'Chat' },
];

export function visibleDestinations(user) {
  return destinations.filter((destination) => destination.navigation &&
    (!destination.accountEntry || !user) &&
    (!destination.requiresAuth || (user && canAccess(user, destination))));
}
