import { formatMoney } from '../../utils/formatMoney.js';

const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', nequi: 'Nequi' };

export default function SaleHistoryCard({ sale, products }) {
  return (
    <li className="shopping-panel order-card">
      <h3>Venta {sale.id}</h3>
      <p>Origen: {sale.orderId ? 'Compra de cliente' : 'Venta en tienda'}</p>
      <p>Fecha: {sale.date ? new Date(sale.date).toLocaleString('es-CO') : 'No disponible'}</p>
      <ul className="order-items">{sale.items.map(({ productId, quantity, unitPrice }) => {
        const product = products.find(({ id }) => id === productId);
        return <li key={productId}>{product?.name ?? 'Producto no disponible'} · {quantity} × {formatMoney(unitPrice)}</li>;
      })}</ul>
      <p>Total: <strong>{formatMoney(sale.total)}</strong></p>
      <p>Pagos simulados: {sale.payments.map(({ method, amount }) =>
        `${methodLabels[method] ?? 'Método no disponible'} ${formatMoney(amount)}`).join(' + ')}</p>
    </li>
  );
}
