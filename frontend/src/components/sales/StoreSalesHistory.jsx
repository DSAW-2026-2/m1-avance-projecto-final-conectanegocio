import { getStoreSaleHistory } from '../../utils/storeSales.js';
import SaleHistoryCard from './SaleHistoryCard.jsx';

export default function StoreSalesHistory({ sales, user, stores, products }) {
  const history = getStoreSaleHistory(sales, user, stores);
  return (
    <section className="sale-history" aria-labelledby="sale-history-title">
      <h2 id="sale-history-title">Historial de ventas de tu tienda</h2>
      <p>Incluye compras de clientes y ventas en tienda de esta sesión; se reinicia al recargar.</p>
      {!history.length ? (
        <div className="shopping-panel"><p>Aún no hay ventas registradas para tu tienda en esta sesión.</p></div>
      ) : (
        <ul className="order-list">{history.map((sale) => (
          <SaleHistoryCard key={sale.id} sale={sale} products={products} />
        ))}</ul>
      )}
    </section>
  );
}
