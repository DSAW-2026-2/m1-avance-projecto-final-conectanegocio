import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import OrderStatusCard from '../components/supply/OrderStatusCard.jsx';
import Notice from '../components/common/Notice.jsx';

export default function DistributorOrdersPage() {
  const { currentUser } = useAuth();
  const { orders, products, updateOrderStatus, supplyNotice } = useData();
  const own = orders.filter((order) => order.orderType === 'supplier' && order.distributorId === currentUser.distributorId);
  function action(order) { const next = { pending: 'confirmed', confirmed: 'shipped', shipped: 'delivered' }[order.status]; return next ? <button type="button" onClick={() => updateOrderStatus(order.id, next)}>Marcar {next}</button> : null; }
  return <div className="container shopping-page"><p className="eyebrow">Distribuidor</p><h1>Pedidos recibidos</h1><p>Actualiza el estado para que la tienda vea el avance.</p><Notice notice={supplyNotice} />
    {!own.length ? <div className="shopping-panel"><p>No hay pedidos pendientes para este distribuidor.</p></div> : <ul className="order-list">{own.map((order) => <OrderStatusCard key={order.id} order={order} products={products} action={action(order)} />)}</ul>}</div>;
}
