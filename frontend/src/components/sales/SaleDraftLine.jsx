import { formatMoney } from '../../utils/formatMoney.js';

export default function SaleDraftLine({ line, onQuantity, onRemove }) {
  const inputId = `sale-quantity-${line.productId}`;
  return (
    <li className="shopping-line">
      <div>
        <h3>{line.name}</h3>
        <p>Precio unitario: {line.unitPrice === null ? 'No disponible' : formatMoney(line.unitPrice)}</p>
        <p>Subtotal: {line.subtotal === null ? 'No disponible' : formatMoney(line.subtotal)}</p>
        {line.problem && <p className="form-error" id={`${inputId}-error`}>{line.problem}</p>}
      </div>
      <div className="shopping-line-actions">
        <label htmlFor={inputId}>Cantidad de {line.name}</label>
        <input id={inputId} type="number" min="1" step="1" inputMode="numeric"
          value={line.quantity} aria-invalid={Boolean(line.problem)}
          aria-describedby={line.problem ? `${inputId}-error` : undefined}
          onChange={(event) => onQuantity(line.productId, event.target.value)} />
        <button type="button" onClick={() => onRemove(line.productId)}>Quitar</button>
      </div>
    </li>
  );
}
