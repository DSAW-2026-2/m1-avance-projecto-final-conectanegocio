import { formatMoney } from '../../utils/formatMoney.js';

const statusLabels = { pending: 'Pendiente', confirmed: 'Confirmado', ready: 'Listo',
  completed: 'Completado', cancelled: 'Cancelado' };
const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', nequi: 'Nequi' };

export default function OrderCard({ entry, products, stores }) {
  const { order, sale, total } = entry;
  const store = stores.find(({ id }) => id === order.storeId);

  return (
    <li className="shopping-panel order-card">
      <h2>Pedido {order.id}</h2>
      <p>Tienda: {store?.name ?? 'No disponible'}</p>
      <p>Estado: <strong>{statusLabels[order.status] ?? 'No disponible'}</strong></p>
      <p>Fecha: {order.createdAt ? new Date(order.createdAt).toLocaleString('es-CO') : 'No disponible'}</p>
      <ul className="order-items">{order.items.map((item) => {
        const product = products.find(({ id }) => id === item.productId);
        return (
          <li key={item.productId}>
            {product?.name ?? 'Producto no disponible'} · {item.quantity} × {formatMoney(item.unitPrice)}
          </li>
        );
      })}</ul>
      <p>Total del pedido: <strong>{total === null ? 'No disponible' : formatMoney(total)}</strong></p>
      {sale ? (
        <p>Pago simulado: {sale.payments.map(({ method, amount }) =>
          `${methodLabels[method] ?? 'Método desconocido'} ${formatMoney(amount)}`).join(' + ')}</p>
      ) : <p>El registro de venta de demostración no está disponible.</p>}
    </li>
  );
}
