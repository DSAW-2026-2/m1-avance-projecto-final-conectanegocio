import { getProductDetail, isValidStoreId } from './catalog.js';
import { canAccess } from './permissions.js';
import { clientCartDestination } from '../routes/destinations.js';

export const emptyCart = () => ({ customerId: null, storeId: null, items: [] });
const notice = (kind, message) => ({ kind, message });
const denied = (state, message) => ({ ...state, shoppingNotice: notice('error', message) });
export const canShop = (user) => canAccess(user, clientCartDestination);
export const ownedCart = (cart, user) => canShop(user) && cart.customerId === user.id ? cart : emptyCart();

export function cartSummary(cart, inventory, products, stores) {
  const lines = cart.items.map(({ productId, quantity }) => {
    const detail = getProductDetail(productId, cart.storeId, products, inventory, stores);
    const item = detail.kind === 'offered' ? detail.inventoryItem : null;
    const validPrice = item && Number.isFinite(item.salePrice) && item.salePrice >= 0;
    const validStock = item && Number.isInteger(item.quantity) && item.quantity >= 0;
    return {
      productId, product: detail.product, quantity, inventoryItem: item,
      unitPrice: validPrice ? item.salePrice : null,
      subtotal: validPrice && Number.isInteger(quantity) ? item.salePrice * quantity : null,
      problem: !item ? 'Este producto ya no está disponible en esta tienda.'
        : !validPrice || !validStock ? 'La oferta de este producto no es válida.'
          : item.quantity < quantity ? `Solo quedan ${item.quantity} unidades.` : null,
    };
  });
  return { lines, total: lines.every((line) => line.subtotal !== null)
    ? lines.reduce((sum, line) => sum + line.subtotal, 0) : null };
}

export function selectStoreState(state, storeId, stores, user) {
  const selectedStoreId = isValidStoreId(storeId, stores) ? storeId : null;
  if (state.cart.items.length && state.cart.customerId === user?.id && state.cart.storeId !== selectedStoreId) {
    return { ...state, shoppingNotice: notice('store-error', 'Vacía el carrito antes de cambiar de tienda.') };
  }
  return { ...state, selectedStoreId, shoppingNotice: null };
}

export function addCartItem(state, user, productId, quantity, products, stores) {
  if (!canShop(user)) return denied(state, 'Solo un cliente puede comprar.');
  if (!isValidStoreId(state.selectedStoreId, stores)) return denied(state, 'Selecciona una tienda válida.');
  if (!Number.isInteger(quantity) || quantity < 1) return denied(state, 'Indica una cantidad entera mayor que cero.');
  const detail = getProductDetail(productId, state.selectedStoreId, products, state.storeInventory, stores);
  if (detail.kind !== 'offered') return denied(state, 'Producto no disponible en esta tienda.');
  if (!Number.isFinite(detail.inventoryItem.salePrice) || detail.inventoryItem.salePrice < 0) {
    return denied(state, 'El precio de esta oferta no es válido.');
  }
  const cart = state.cart;
  if (cart.items.length && (cart.customerId !== user.id || cart.storeId !== state.selectedStoreId)) {
    return denied(state, 'El carrito pertenece a otra cuenta o tienda.');
  }
  const existing = cart.items.find((line) => line.productId === productId);
  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  if (!Number.isInteger(detail.inventoryItem.quantity) || detail.inventoryItem.quantity < 0) {
    return denied(state, 'Las existencias de esta oferta no son válidas.');
  }
  if (nextQuantity > detail.inventoryItem.quantity) {
    return denied(state, `Solo hay ${detail.inventoryItem.quantity} unidades disponibles.`);
  }
  const items = existing ? cart.items.map((line) => line.productId === productId
    ? { ...line, quantity: nextQuantity } : line) : [...cart.items, { productId, quantity }];
  return { ...state, cart: { customerId: user.id, storeId: state.selectedStoreId, items },
    shoppingNotice: notice('success', 'Producto agregado al carrito.') };
}

export function setCartQuantity(state, user, productId, quantity, products, stores) {
  if (!canShop(user) || state.cart.customerId !== user.id) return denied(state, 'Carrito no disponible.');
  if (!state.cart.items.some((line) => line.productId === productId)) return denied(state, 'Producto ausente del carrito.');
  if (!Number.isInteger(quantity) || quantity < 1) return denied(state, 'Indica una cantidad entera mayor que cero.');
  const detail = getProductDetail(productId, state.cart.storeId, products, state.storeInventory, stores);
  if (detail.kind !== 'offered') return denied(state, 'Producto no disponible en esta tienda.');
  if (!Number.isInteger(detail.inventoryItem.quantity) || detail.inventoryItem.quantity < 0) {
    return denied(state, 'Las existencias de esta oferta no son válidas.');
  }
  if (quantity > detail.inventoryItem.quantity) {
    return denied(state, `Solo hay ${detail.inventoryItem.quantity} unidades disponibles.`);
  }
  return { ...state, cart: { ...state.cart, items: state.cart.items.map((line) => line.productId === productId
    ? { ...line, quantity } : line) }, shoppingNotice: null };
}

export function removeCartItem(state, user, productId) {
  if (!canShop(user) || state.cart.customerId !== user.id) return denied(state, 'Carrito no disponible.');
  const items = state.cart.items.filter((line) => line.productId !== productId);
  if (items.length === state.cart.items.length) return denied(state, 'Producto ausente del carrito.');
  return { ...state, cart: items.length ? { ...state.cart, items } : emptyCart(), shoppingNotice: null };
}

export function clearCartState(state, user) {
  if (state.cart.items.length && state.cart.customerId !== user?.id) return denied(state, 'Carrito no disponible.');
  return { ...state, cart: emptyCart(), shoppingNotice: null };
}

export function clearCartOnLogout(state) {
  return { ...state, cart: emptyCart(), shoppingNotice: null };
}
