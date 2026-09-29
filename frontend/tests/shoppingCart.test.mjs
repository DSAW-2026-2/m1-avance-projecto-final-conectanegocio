import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { storeInventory } from '../src/data/storeInventory.js';
import { stores } from '../src/data/organizations.js';
import { demoUsers } from '../src/data/demoUsers.js';
import { addCartItem, cartSummary, clearCartOnLogout, clearCartState, ownedCart, removeCartItem,
  selectStoreState, setCartQuantity } from '../src/utils/shoppingCart.js';

const client = demoUsers.find((user) => user.role === 'client');
const other = { ...client, id: 'another-client' };
const base = () => ({ selectedStoreId: 's001', storeInventory: [...storeInventory],
  cart: { customerId: null, storeId: null, items: [] }, orders: [], sales: [], shoppingNotice: null });
const withItem = () => addCartItem(base(), client, 'p001', 2, products, stores);

test('cart joins selected-store price, never product or supplier-like price', () => {
  const state = withItem();
  const fakeProducts = products.map((product) => ({ ...product, price: 1 }));
  const summary = cartSummary(state.cart, state.storeInventory, fakeProducts, stores);
  assert.equal(summary.lines[0].unitPrice, 8900);
  assert.equal(summary.total, 17800);
  const repriced = state.storeInventory.map((item) => item.id === 'si001' ? { ...item, salePrice: 9500 } : item);
  assert.equal(cartSummary(state.cart, repriced, products, stores).total, 19000);
  assert.deepEqual(state.cart.items, [{ productId: 'p001', quantity: 2 }]);
});

test('missing and conflicting offers fail closed', () => {
  const state = base();
  assert.equal(addCartItem(state, client, 'missing', 1, products, stores).cart.items.length, 0);
  assert.equal(addCartItem(state, client, 'p002', 1, products, stores).cart.items.length, 1);
  const duplicate = { ...state, storeInventory: [...state.storeInventory, { ...state.storeInventory[0], id: 'si999' }] };
  assert.equal(addCartItem(duplicate, client, 'p001', 1, products, stores).cart.items.length, 0);
  assert.equal(cartSummary({ customerId: client.id, storeId: 's001', items: [{ productId: 'p001', quantity: 1 }] },
    duplicate.storeInventory, products, stores).lines[0].problem !== null, true);
  assert.equal(addCartItem({ ...state, selectedStoreId: null }, client, 'p001', 1, products, stores).cart.items.length, 0);
  assert.equal(addCartItem(state, client, 'p006', 1, products, stores).cart.items.length, 0);
});

test('an exhausted cart item remains visible and removable but cannot increase', () => {
  const state = withItem();
  const inventory = state.storeInventory.map((item) => item.id === 'si001' ? { ...item, quantity: 0 } : item);
  const exhausted = { ...state, storeInventory: inventory };
  assert.match(cartSummary(exhausted.cart, inventory, products, stores).lines[0].problem, /Solo quedan 0/);
  assert.deepEqual(setCartQuantity(exhausted, client, 'p001', 1, products, stores).cart, state.cart);
  assert.deepEqual(removeCartItem(exhausted, client, 'p001').cart.items, []);
});

test('cart operations validate quantity and owner without changing inventory', () => {
  const state = withItem();
  assert.equal(setCartQuantity(state, client, 'p001', 3, products, stores).cart.items[0].quantity, 3);
  for (const quantity of [0, -1, 1.5, 25]) {
    assert.deepEqual(setCartQuantity(state, client, 'p001', quantity, products, stores).cart, state.cart);
  }
  assert.deepEqual(addCartItem(state, client, 'p001', 23, products, stores).cart, state.cart);
  assert.deepEqual(setCartQuantity(state, other, 'p001', 1, products, stores).cart, state.cart);
  assert.deepEqual(ownedCart(state.cart, other).items, []);
  assert.deepEqual(clearCartState(state, other).cart, state.cart);
  assert.deepEqual(removeCartItem(state, client, 'p001').cart.items, []);
  assert.deepEqual(state.storeInventory, storeInventory);
});

test('store switch blocks nonempty cart and succeeds after explicit removal', () => {
  const state = withItem();
  const blocked = selectStoreState(state, 's002', stores, client);
  assert.equal(blocked.selectedStoreId, 's001');
  assert.deepEqual(blocked.cart, state.cart);
  assert.equal(blocked.shoppingNotice.kind, 'store-error');
  const empty = removeCartItem(state, client, 'p001');
  assert.equal(selectStoreState(empty, 's002', stores, client).selectedStoreId, 's002');
  assert.equal(selectStoreState(empty, 'invalid', stores, client).selectedStoreId, null);
});

test('logout clears cart and another account cannot act on it', () => {
  const state = withItem();
  assert.deepEqual(ownedCart(state.cart, other).items, []);
  assert.deepEqual(addCartItem(state, other, 'p001', 1, products, stores).cart, state.cart);
  const signedOut = clearCartOnLogout(state);
  assert.deepEqual(signedOut.cart.items, []);
  assert.equal(signedOut.cart.customerId, null);
});
