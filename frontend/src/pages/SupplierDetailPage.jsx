import { useState } from 'react';
import { useParams } from 'react-router';
import { useData } from '../context/useData.js';
import { useAuth } from '../context/useAuth.js';
import { distributors } from '../data/organizations.js';
import PurchaseOrderForm from '../components/supply/PurchaseOrderForm.jsx';
import Notice from '../components/common/Notice.jsx';

export default function SupplierDetailPage() {
  const { supplierId } = useParams();
  const { currentUser } = useAuth();
  const { products, supplierOffers, createPurchaseOrder, supplyNotice } = useData();
  const supplier = distributors.find(({ id }) => id === supplierId);
  const offers = supplierOffers.filter(({ distributorId }) => distributorId === supplierId);
  const [offerId, setOfferId] = useState(offers[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const offer = offers.find(({ id }) => id === offerId);
  function submit(event) { event.preventDefault(); createPurchaseOrder({ offerId, productId: offer?.productId, distributorId: supplierId, quantity: Number(quantity) }); }
  if (!supplier) return <div className="container page-center"><div className="empty-state"><h1>Distribuidor no encontrado</h1></div></div>;
  return <div className="container catalog-page"><div className="catalog-intro"><p className="eyebrow">Distribuidor</p><h1>{supplier.name}</h1><p>Entrega demo en {supplier.deliveryDays ?? 2} días.</p></div>
    <Notice notice={supplyNotice} /><section className="catalog-toolbar"><label htmlFor="supplier-offer">Oferta</label><select id="supplier-offer" value={offerId} onChange={(e) => setOfferId(e.target.value)}>{offers.map((item) => <option key={item.id} value={item.id}>{products.find(({ id }) => id === item.productId)?.name} · {item.price} COP</option>)}</select>
    <PurchaseOrderForm offer={{ ...offer, distributor: supplier }} quantity={quantity} onQuantity={(e) => setQuantity(e.target.value)} onSubmit={submit} /></section></div>;
}
