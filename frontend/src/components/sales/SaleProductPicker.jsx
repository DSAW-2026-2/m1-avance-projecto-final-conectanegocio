import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import { formatMoney } from '../../utils/formatMoney.js';

export default function SaleProductPicker({ offers, onAdd }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');
  const options = offers.map(({ product, inventoryItem }) => ({ value: product.id,
    label: `${product.name} · ${formatMoney(inventoryItem.salePrice)} · ${inventoryItem.quantity} disponibles` }));

  function submit(event) {
    event.preventDefault();
    const offer = offers.find(({ product }) => product.id === productId);
    const count = Number(quantity);
    if (!offer || !Number.isInteger(count) || count < 1 || count > offer.inventoryItem.quantity) {
      setError('Selecciona un producto disponible y una cantidad entera dentro de sus existencias.');
      return;
    }
    onAdd(productId, String(count));
    setProductId('');
    setQuantity('1');
    setError('');
  }

  return (
    <section className="shopping-panel" aria-labelledby="sale-picker-title">
      <h2 id="sale-picker-title">Agregar producto</h2>
      {!offers.length && <p>No hay más productos con existencias disponibles para agregar.</p>}
      <form className="sale-picker-form" onSubmit={submit} noValidate>
        <FormField label="Producto de tu tienda" name="sale-product" value={productId}
          onChange={(event) => { setProductId(event.target.value); setError(''); }} options={options} />
        <FormField label="Cantidad" name="sale-add-quantity" type="number" min="1" step="1"
          inputMode="numeric" value={quantity} onChange={(event) => { setQuantity(event.target.value); setError(''); }} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" disabled={!offers.length}>Agregar a la venta</button>
      </form>
    </section>
  );
}
