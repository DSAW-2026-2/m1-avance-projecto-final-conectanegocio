import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { getClientOrderHistory } from '../utils/shoppingHistory.js';
import OrderCard from '../components/shopping/OrderCard.jsx';

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { orders, sales, products, stores } = useData();
  const history = getClientOrderHistory(orders, sales, currentUser);

  return (
    <div className="container shopping-page">
      <p className="eyebrow">Historial de demostración</p>
      <h1>Mis pedidos</h1>
      <p>Solo aparecen tus pedidos de esta sesión. Al recargar, las compras simuladas pueden desaparecer.</p>
      {!history.length ? (
        <div className="shopping-panel">
          <h2>Aún no tienes pedidos en esta sesión</h2>
          <p>Explora el catálogo y realiza una compra simulada para ver un pedido aquí.</p>
          <Link className="text-link" to="/products">Explorar catálogo</Link>
        </div>
      ) : (
        <ul className="order-list">{history.map((entry) => (
          <OrderCard key={entry.order.id} entry={entry} products={products} stores={stores} />
        ))}</ul>
      )}
    </div>
  );
}
