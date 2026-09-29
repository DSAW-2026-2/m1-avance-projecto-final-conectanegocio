import { Link } from 'react-router';
import { formatMoney } from '../../utils/formatMoney.js';

const labels = { available: 'Disponible', low: 'Pocas unidades', out: 'Agotado' };

export default function ProductCard({ offer }) {
  const { product, inventoryItem, availability } = offer;
  return (
    <article className="product-card">
      <p className="eyebrow">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="product-price">{formatMoney(inventoryItem.salePrice)}</p>
      <p className={`stock-badge stock-badge--${availability}`}>{labels[availability]}</p>
      <p className="product-quantity">{inventoryItem.quantity} unidades en esta tienda</p>
      <Link className="text-link" to={`/products/${product.id}`} aria-label={`Ver detalle de ${product.name}`}>
        Ver detalle <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
