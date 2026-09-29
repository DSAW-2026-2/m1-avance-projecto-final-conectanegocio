import { useState } from 'react';
import { formatMoney } from '../../utils/formatMoney.js';

export default function CartLine({ line, onQuantity, onRemove }) {
  const [draft, setDraft] = useState(String(line.quantity));
  const name = line.product?.name ?? 'Producto no disponible';
  const inputId = `cart-quantity-${line.productId}`;

  function submit(event) {
    event.preventDefault();
    onQuantity(line.productId, draft === '' ? 0 : Number(draft));
  }

  return (
    <li className="shopping-line">
      <div>
        <h2>{name}</h2>
        <p>Precio unitario: {line.unitPrice === null ? 'No disponible' : formatMoney(line.unitPrice)}</p>
        <p>Subtotal: {line.subtotal === null ? 'No disponible' : formatMoney(line.subtotal)}</p>
        {line.problem && <p className="form-error">{line.problem}</p>}
      </div>
      <div className="shopping-line-actions">
        <form onSubmit={submit} noValidate>
          <label htmlFor={inputId}>Cantidad de {name}</label>
          <input id={inputId} type="number" min="1" step="1" inputMode="numeric"
            value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="submit">Actualizar</button>
        </form>
        <button type="button" onClick={() => onRemove(line.productId)}>Quitar</button>
      </div>
    </li>
  );
}
