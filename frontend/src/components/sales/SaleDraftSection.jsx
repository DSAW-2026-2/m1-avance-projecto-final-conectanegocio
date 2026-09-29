import SaleDraftLine from './SaleDraftLine.jsx';
import { formatMoney } from '../../utils/formatMoney.js';

export default function SaleDraftSection({ summary, onQuantity, onRemove }) {
  return (
    <section aria-labelledby="sale-lines-title">
      <h2 id="sale-lines-title">Productos de esta venta</h2>
      {!summary.lines.length ? <p>Aún no hay productos seleccionados.</p> : (
        <ul className="shopping-lines">{summary.lines.map((line) => (
          <SaleDraftLine key={line.productId} line={line} onQuantity={onQuantity} onRemove={onRemove} />
        ))}</ul>
      )}
      <p>Total derivado: <strong>{summary.total === null ? 'No disponible' : formatMoney(summary.total)}</strong></p>
    </section>
  );
}
