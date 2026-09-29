import FormField from '../common/FormField.jsx';
import { formatMoney } from '../../utils/formatMoney.js';

const methods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'nequi', label: 'Nequi' },
];

export default function SalePaymentForm({ total, method, onMethod, onSubmit, error, pending }) {
  return (
    <section className="shopping-panel shopping-checkout" aria-labelledby="sale-payment-title">
      <h2 id="sale-payment-title">Pago simulado</h2>
      <p>Total actual: <strong>{total === null ? 'No disponible' : formatMoney(total)}</strong></p>
      <p>Esta venta y su pago existen solo en esta sesión. No se procesa ni cobra dinero real.</p>
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Medio de pago" name="sale-payment-method" value={method} onChange={onMethod}
          options={methods} error={error && !method ? error : ''} />
        {error && method && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" disabled={pending}>{pending ? 'Registrando…' : 'Registrar venta simulada'}</button>
      </form>
    </section>
  );
}
