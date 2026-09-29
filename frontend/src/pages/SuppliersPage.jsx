import { useState } from 'react';
import { useData } from '../context/useData.js';
import SupplierComparison from '../components/supply/SupplierComparison.jsx';
import SupplierFilters from '../components/supply/SupplierFilters.jsx';
import { distributors } from '../data/organizations.js';
import { getOffersForProduct, sortOffersByDelivery, sortOffersByPrice, sortOffersByStock } from '../utils/supplierUtils.js';

export default function SuppliersPage() {
  const { products, supplierOffers } = useData();
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [sort, setSort] = useState('price');
  const offers = getOffersForProduct(productId, supplierOffers, distributors);
  const ordered = sort === 'delivery' ? sortOffersByDelivery(offers) : sort === 'stock' ? sortOffersByStock(offers) : sortOffersByPrice(offers);
  return <div className="container catalog-page"><div className="catalog-intro"><p className="eyebrow">Abastecimiento</p><h1>Comparar distribuidores</h1><p>Revisa precio, stock y entrega antes de crear un pedido.</p></div>
    <section className="catalog-toolbar"><SupplierFilters products={products} productId={productId} onProduct={(e) => setProductId(e.target.value)} sort={sort} onSort={(e) => setSort(e.target.value)} /></section>
    <SupplierComparison offers={ordered} /></div>;
}
