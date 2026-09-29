import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import { formatMoney } from '../../utils/formatMoney.js';

const methods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'nequi', label: 'Nequi' },
];

export default function CheckoutForm({ total, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!paymentMethod) {
      setError('Selecciona un medio de pago para continuar.');
      return;
    }
    setError('');
    onCheckout({ paymentMethod });
  }

  return (
    <section className="shopping-panel shopping-checkout" aria-labelledby="checkout-title">
      <h2 id="checkout-title">Finalizar compra simulada</h2>
      <p>Total actual: <strong>{total === null ? 'No disponible' : formatMoney(total)}</strong></p>
      <p>No se procesará ningún pago real. El pedido y el pago simulado solo existen en esta sesión.</p>
      <form onSubmit={submit} noValidate>
        <FormField label="Medio de pago simulado" name="payment-method" value={paymentMethod}
          onChange={(event) => { setPaymentMethod(event.target.value); setError(''); }}
          options={methods} error={error} />
        <button type="submit">Confirmar compra simulada</button>
      </form>
    </section>
  );
}
