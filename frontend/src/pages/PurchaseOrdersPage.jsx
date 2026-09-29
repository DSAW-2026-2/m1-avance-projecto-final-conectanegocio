import { Link } from 'react-router';
import { useData } from '../context/useData.js';
import { useAuth } from '../context/useAuth.js';
import OrderStatusCard from '../components/supply/OrderStatusCard.jsx';
import Notice from '../components/common/Notice.jsx';

export default function PurchaseOrdersPage() {
  const { currentUser } = useAuth();
  const { orders, products, supplyNotice } = useData();
  const own = orders.filter((order) => order.orderType === 'supplier' && order.storeId === currentUser.storeId);
  return <div className="container shopping-page"><p className="eyebrow">Abastecimiento</p><h1>Pedidos a distribuidores</h1><p>Los pedidos avanzan cuando el distribuidor confirma, envía y entrega.</p><Notice notice={supplyNotice} />
    {!own.length ? <div className="shopping-panel"><p>Aún no hay pedidos de compra.</p><Link className="text-link" to="/store/suppliers">Comparar ofertas</Link></div> : <ul className="order-list">{own.map((order) => <OrderStatusCard key={order.id} order={order} products={products} />)}</ul>}</div>;
}
