// Public demo identities only. Never enter real credentials in this frontend prototype.
const demoPassword = 'Demo2026!';

export const demoUsers = [
  { id: 'u001', name: 'Cliente Demo', email: 'cliente@demo.test', password: demoPassword, role: 'client' },
  { id: 'u002', name: 'Admin Tienda', email: 'tienda.admin@demo.test', password: demoPassword, role: 'store_admin', storeId: 's001' },
  { id: 'u003', name: 'Cajero Demo', email: 'cajero@demo.test', password: demoPassword, role: 'store_employee', subRole: 'cashier', storeId: 's001' },
  { id: 'u004', name: 'Inventario Tienda', email: 'tienda.inventario@demo.test', password: demoPassword, role: 'store_employee', subRole: 'inventory', storeId: 's002' },
  { id: 'u005', name: 'Admin Distribuidor', email: 'distribuidor.admin@demo.test', password: demoPassword, role: 'distributor_admin', distributorId: 'd001' },
  { id: 'u006', name: 'Ventas Distribuidor', email: 'distribuidor.ventas@demo.test', password: demoPassword, role: 'distributor_employee', subRole: 'sales', distributorId: 'd001' },
  { id: 'u007', name: 'Inventario Distribuidor', email: 'distribuidor.inventario@demo.test', password: demoPassword, role: 'distributor_employee', subRole: 'inventory', distributorId: 'd002' },
  { id: 'u008', name: 'Logística Distribuidor', email: 'distribuidor.logistica@demo.test', password: demoPassword, role: 'distributor_employee', subRole: 'logistics', distributorId: 'd003' },
];
