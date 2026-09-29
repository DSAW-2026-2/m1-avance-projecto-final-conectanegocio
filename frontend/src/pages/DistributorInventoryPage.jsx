import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { products } from '../data/products.js';

export default function DistributorInventoryPage() {
  const { currentUser } = useAuth(); const { supplierOffers } = useData();
  const rows = supplierOffers.filter(({ distributorId }) => distributorId === currentUser.distributorId);
  return <div className="container shopping-page"><p className="eyebrow">Distribuidor</p><h1>Catálogo e inventario</h1><p>Estas ofertas alimentan la comparación de las tiendas.</p>
    <ul className="inventory-grid">{rows.map((offer) => <li className="shopping-panel" key={offer.id}><h2>{products.find(({ id }) => id === offer.productId)?.name}</h2><p>{offer.stock} unidades · {offer.price} COP · {offer.deliveryDays} días</p></li>)}</ul></div>;
}
