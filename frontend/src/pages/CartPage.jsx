import { Link } from 'react-router';
import { useData } from '../context/useData.js';
import { formatMoney } from '../utils/formatMoney.js';
import CartLine from '../components/shopping/CartLine.jsx';
import CheckoutForm from '../components/shopping/CheckoutForm.jsx';

export default function CartPage() {
  const { cart, cartSummary, stores, changeCartQuantity, removeFromCart, clearCart,
    checkoutCustomerOrder, shoppingNotice } = useData();
  const store = stores.find(({ id }) => id === cart.storeId);

  return (
    <div className="container shopping-page">
      <p className="eyebrow">Compras simuladas</p>
      <h1>Mi carrito</h1>
      <p>Este carrito y tus compras existen solo durante esta sesión. No se realizará ningún cargo real.</p>
      {shoppingNotice?.kind === 'error' && <p className="form-error" role="alert">{shoppingNotice.message}</p>}
      {shoppingNotice?.kind === 'checkout-success' && !cart.items.length ? (
        <div className="shopping-panel" role="status">
          <h2>Compra registrada en esta sesión</h2>
          <p>Pedido {shoppingNotice.orderId}. No se realizó ningún cargo real.</p>
          <Link className="text-link" to="/client/orders">Ver mis pedidos</Link>
        </div>
      ) : !cart.items.length ? (
        <div className="shopping-panel">
          <h2>Tu carrito está vacío</h2>
          <p>Selecciona una tienda y explora sus productos para empezar.</p>
          <Link className="text-link" to="/products">Explorar catálogo</Link>
        </div>
      ) : (
        <>
          <p>Carrito de <strong>{store?.name ?? 'tienda no disponible'}</strong>. Vacíalo para cambiar de tienda.</p>
          <ul className="shopping-lines">{cartSummary.lines.map((line) => (
            <CartLine key={line.productId} line={line} onQuantity={changeCartQuantity} onRemove={removeFromCart} />
          ))}</ul>
          <div className="shopping-panel shopping-total">
            <p>Total: <strong>{cartSummary.total === null ? 'No disponible' : formatMoney(cartSummary.total)}</strong></p>
            <button type="button" onClick={clearCart}>Vaciar carrito</button>
          </div>
          <CheckoutForm total={cartSummary.total} onCheckout={checkoutCustomerOrder} />
        </>
      )}
    </div>
  );
}
