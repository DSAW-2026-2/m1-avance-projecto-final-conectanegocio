import { Link } from 'react-router';
import { formatMoney } from '../../utils/formatMoney.js';

export default function SupplierComparison({ offers }) {
  if (!offers.length) return <div className="catalog-message"><h2>Sin ofertas</h2><p>No hay ofertas demo para este producto.</p></div>;
  return <div className="supplier-grid">{offers.map((offer) => <article className="product-card" key={offer.id}>
    <p className="eyebrow">{offer.distributor.name}</p><h2>{formatMoney(offer.price)}</h2>
    <p>{offer.stock} unidades · {offer.deliveryDays} días de entrega</p>
    <Link className="text-link" to={`/store/suppliers/${offer.distributorId}`}>Ver distribuidor</Link>
  </article>)}</div>;
}
