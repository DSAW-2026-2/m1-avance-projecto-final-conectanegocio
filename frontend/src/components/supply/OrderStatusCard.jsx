import { orderStatusLabel } from '../../utils/orderUtils.js';

export default function OrderStatusCard({ order, products, action }) {
  return <li className="shopping-panel order-card"><h2>{order.id} · {orderStatusLabel(order.status)}</h2>
    <p>Tipo: {order.orderType === 'supplier' ? 'Compra a distribuidor' : 'Pedido de cliente'}</p>
    <ul className="order-items">{order.items.map((item) => <li key={item.productId}>{products.find(({ id }) => id === item.productId)?.name} · {item.quantity}</li>)}</ul>
    {action}</li>;
}
