import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { formatMoney } from '../utils/formatMoney.js';
import { getNumberOfSales, getPurchaseRecommendations, getSalesByPaymentMethod, getTotalRevenue, getTopSellingProducts } from '../utils/reportUtils.js';
import MetricCard from '../components/reports/MetricCard.jsx';

export default function ReportsPage() {
  const { currentUser } = useAuth(); const { products, sales, storeInventory } = useData();
  const own = sales.filter(({ storeId }) => storeId === currentUser.storeId); const methods = getSalesByPaymentMethod(own);
  const top = getTopSellingProducts(own, products); const recommendations = getPurchaseRecommendations(storeInventory.filter(({ storeId }) => storeId === currentUser.storeId), own, products);
  return <div className="container shopping-page"><p className="eyebrow">Inteligencia comercial</p><h1>Reportes</h1><p>Indicadores calculados desde ventas e inventario de esta sesión.</p>
    <div className="metric-grid"><MetricCard label="Ventas" value={getNumberOfSales(own)} /><MetricCard label="Ingresos" value={formatMoney(getTotalRevenue(own))} /><MetricCard label="Efectivo" value={formatMoney(methods.cash ?? 0)} /><MetricCard label="Nequi" value={formatMoney(methods.nequi ?? 0)} /></div>
    <section className="shopping-panel"><h2>Más vendidos</h2>{top.length ? <ol>{top.slice(0, 5).map(({ product, quantity }) => <li key={product.id}>{product.name}: {quantity}</li>)}</ol> : <p>Aún no hay ventas.</p>}</section>
    <section className="shopping-panel"><h2>Recomendaciones</h2>{recommendations.length ? <ul>{recommendations.map(({ product, priority }) => <li key={product.id}>{product.name}: prioridad {priority}</li>)}</ul> : <p>No hay productos para reponer.</p>}</section></div>;
}
