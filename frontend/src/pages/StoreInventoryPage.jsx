import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { getLowStockProducts } from '../utils/reportUtils.js';

export default function StoreInventoryPage() {
  const { currentUser } = useAuth();
  const { products, storeInventory } = useData();
  const rows = storeInventory.filter(({ storeId }) => storeId === currentUser.storeId);
  const low = getLowStockProducts(rows, products);
  return <div className="container shopping-page"><p className="eyebrow">Tienda</p><h1>Inventario</h1><p>Las ventas reducen stock y las entregas de proveedores lo aumentan.</p>
    <div className="metric-grid"><article className="metric-card"><p>Referencias</p><strong>{rows.length}</strong></article><article className="metric-card"><p>Bajo stock</p><strong>{low.length}</strong></article></div>
    <ul className="inventory-grid">{rows.map((row) => <li className="shopping-panel" key={row.id}><h2>{products.find(({ id }) => id === row.productId)?.name}</h2><p>{row.quantity} unidades · mínimo {row.minStock}</p></li>)}</ul></div>;
}
