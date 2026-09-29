import { formatMoney } from '../../utils/formatMoney.js';

const labels = { available: 'Disponible', low: 'Pocas unidades', out: 'Agotado' };

export default function ProductOfferDetails({ store, inventoryItem, availability }) {
  return (
    <section className="product-offer" aria-label={`Oferta de ${store.name}`}>
      <p className="eyebrow">Oferta de {store.name}</p>
      <p className="product-detail-price">{formatMoney(inventoryItem.salePrice)}</p>
      <p className={`stock-badge stock-badge--${availability}`}>{labels[availability]}</p>
      <p>{inventoryItem.quantity} unidades en esta tienda</p>
      {availability === 'out' && <p>Este producto no está disponible para compra en esta tienda.</p>}
    </section>
  );
}
