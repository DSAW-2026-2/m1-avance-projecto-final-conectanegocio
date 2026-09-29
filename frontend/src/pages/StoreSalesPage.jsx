import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useData } from '../context/useData.js';
import { saleDraftSummary, saleOptions } from '../utils/storeSaleDraft.js';
import SaleProductPicker from '../components/sales/SaleProductPicker.jsx';
import SaleDraftSection from '../components/sales/SaleDraftSection.jsx';
import SalePaymentForm from '../components/sales/SalePaymentForm.jsx';
import StoreSalesHistory from '../components/sales/StoreSalesHistory.jsx';

const freshDraft = () => ({ submissionId: globalThis.crypto.randomUUID(), lines: [], paymentMethod: '' });

export default function StoreSalesPage() {
  const { currentUser } = useAuth();
  const { products, stores, sales, storeInventory, storeSaleNotice, registerStoreSale } = useData();
  const [draft, setDraft] = useState(freshDraft);
  const [formError, setFormError] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const store = stores.find(({ id }) => id === currentUser.storeId);
  const summary = saleDraftSummary(draft.lines, currentUser.storeId, products, storeInventory, stores);
  const offers = saleOptions(currentUser.storeId, products, storeInventory, stores, draft.lines);
  const notice = storeSaleNotice?.submissionId === draft.submissionId ? storeSaleNotice : null;
  const completed = notice?.kind === 'success';
  const pending = pendingId === draft.submissionId && !notice;

  function submit(event) {
    event.preventDefault();
    if (!summary.total || !draft.paymentMethod) {
      setFormError(!summary.total ? 'Agrega productos válidos y corrige sus cantidades.' :
        'Selecciona un medio de pago.');
      return;
    }
    setFormError('');
    setPendingId(draft.submissionId);
    registerStoreSale({ submissionId: draft.submissionId,
      lines: draft.lines.map(({ productId, quantity }) => ({ productId, quantity: Number(quantity) })),
      payments: [{ method: draft.paymentMethod, amount: summary.total }] });
  }

  return (
    <div className="container shopping-page store-sales-page">
      <p className="eyebrow">Operación de tienda · demo</p>
      <h1>Ventas de {store?.name ?? 'tu tienda'}</h1>
      <p>Registra ventas y consulta el historial de tu tienda en esta sesión. Los pagos son simulados.</p>
      {!store ? <p className="form-error" role="alert">Tu tienda no está disponible.</p> : completed ? (
        <section className="shopping-panel" role="status" aria-labelledby="sale-success-title">
          <h2 id="sale-success-title">Venta simulada registrada</h2>
          <p>Venta {notice.saleId}. No se realizó ningún cobro real.</p>
          <button type="button" onClick={() => { setDraft(freshDraft()); setFormError(''); }}>Nueva venta</button>
        </section>
      ) : (
        <>
          <SaleProductPicker offers={offers} onAdd={(productId, quantity) => {
            setDraft((previous) => ({ ...previous, lines: [...previous.lines, { productId, quantity }] }));
            setFormError('');
          }} />
          <SaleDraftSection summary={summary} onQuantity={(productId, quantity) => {
            setDraft((previous) => ({ ...previous, lines: previous.lines.map((item) =>
              item.productId === productId ? { ...item, quantity } : item) }));
            setFormError('');
          }} onRemove={(productId) => {
            setDraft((previous) => ({ ...previous,
              lines: previous.lines.filter((item) => item.productId !== productId) }));
            setFormError('');
          }} />
          {notice?.kind === 'error' && <p className="form-error" role="alert">{notice.message}</p>}
          <SalePaymentForm total={summary.total} method={draft.paymentMethod}
            onMethod={(event) => { setDraft((previous) => ({ ...previous, paymentMethod: event.target.value }));
              setFormError(''); }} onSubmit={submit} error={formError} pending={pending} />
        </>
      )}
      {store && <StoreSalesHistory sales={sales} user={currentUser} stores={stores} products={products} />}
    </div>
  );
}
