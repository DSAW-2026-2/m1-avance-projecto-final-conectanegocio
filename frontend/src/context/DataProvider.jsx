import { useState } from 'react';
import { products } from '../data/products.js';
import { storeInventory } from '../data/storeInventory.js';
import { stores } from '../data/organizations.js';
import { useAuth } from './useAuth.js';
import { addCartItem, cartSummary, clearCartOnLogout, clearCartState, ownedCart,
  removeCartItem, selectStoreState, setCartQuantity } from '../utils/shoppingCart.js';
import { checkoutState } from '../utils/shoppingCheckout.js';
import { registerStoreSaleState } from '../utils/storeSales.js';
import { DataContext } from './DataContext.js';

export default function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, setState] = useState(() => ({ selectedStoreId: null, storeInventory: [...storeInventory],
    cart: { customerId: null, storeId: null, items: [] }, orders: [], sales: [],
    shoppingNotice: null, storeSaleNotice: null }));
  const cart = ownedCart(state.cart, currentUser);
  const summary = cartSummary(cart, state.storeInventory, products, stores);

  function selectStore(storeId) {
    setState((previous) => selectStoreState(previous, storeId, stores, currentUser));
  }

  function addToCart(productId, quantity = 1) {
    setState((previous) => addCartItem(previous, currentUser, productId, quantity, products, stores));
  }

  function changeCartQuantity(productId, quantity) {
    setState((previous) => setCartQuantity(previous, currentUser, productId, quantity, products, stores));
  }

  function removeFromCart(productId) {
    setState((previous) => removeCartItem(previous, currentUser, productId));
  }

  function clearCart() {
    setState((previous) => clearCartState(previous, currentUser));
  }

  function clearCartForLogout() {
    setState(clearCartOnLogout);
  }

  function checkoutCustomerOrder(input) {
    const submittedAt = new Date().toISOString();
    setState((previous) => checkoutState(previous, currentUser, input, products, stores, submittedAt));
  }

  function registerStoreSale(input) {
    const submittedAt = new Date().toISOString();
    setState((previous) => registerStoreSaleState(previous, currentUser, input, products, stores, submittedAt));
  }

  const value = { products, stores, ...state, cart, cartSummary: summary, selectStore, addToCart,
    changeCartQuantity, removeFromCart, clearCart, clearCartForLogout, checkoutCustomerOrder, registerStoreSale };
  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}
