import FormField from '../common/FormField.jsx';

export default function PurchaseOrderForm({ offer, quantity, onQuantity, onSubmit }) {
  if (!offer) return null;
  return <form className="purchase-form" onSubmit={onSubmit}>
    <p>Crear pedido con {offer.distributor.name} a {offer.price} COP por unidad.</p>
    <FormField label="Cantidad" name="purchase-quantity" type="number" min="1" max={offer.stock}
      value={quantity} onChange={onQuantity} />
    <button type="submit">Crear pedido pendiente</button>
  </form>;
}
