import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/useAuth.js';
import { useData } from '../../context/useData.js';
import { canShop } from '../../utils/shoppingCart.js';

export default function AddToCartAction({ productId, quantity }) {
  const { currentUser } = useAuth();
  const { addToCart, shoppingNotice } = useData();
  const [attempted, setAttempted] = useState(false);
  if (!canShop(currentUser) || quantity <= 0) return null;

  function add() {
    setAttempted(true);
    addToCart(productId);
  }

  return (
    <div className="shopping-action">
      <button type="button" onClick={add}>Agregar al carrito</button>
      {attempted && shoppingNotice && shoppingNotice.kind !== 'store-error' && (
        <p role={shoppingNotice.kind === 'error' ? 'alert' : 'status'}>{shoppingNotice.message}</p>
      )}
      {attempted && shoppingNotice?.kind === 'success' && <Link to="/client/cart">Ver mi carrito</Link>}
    </div>
  );
}
