import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const [{ default: ProductsPage }, { default: ProductDetailPage }, { DataContext }, { AuthContext },
  { products }, { storeInventory }, { stores }, { demoUsers }] = await Promise.all([
  vite.ssrLoadModule('/src/pages/ProductsPage.jsx'),
  vite.ssrLoadModule('/src/pages/ProductDetailPage.jsx'),
  vite.ssrLoadModule('/src/context/DataContext.js'),
  vite.ssrLoadModule('/src/context/AuthContext.js'),
  vite.ssrLoadModule('/src/data/products.js'),
  vite.ssrLoadModule('/src/data/storeInventory.js'),
  vite.ssrLoadModule('/src/data/organizations.js'),
  vite.ssrLoadModule('/src/data/demoUsers.js'),
]);

function render(path, selectedStoreId, inventory = storeInventory, currentUser = null) {
  const routes = React.createElement(Routes, null,
    React.createElement(Route, { path: '/products', element: React.createElement(ProductsPage) }),
    React.createElement(Route, { path: '/products/:productId', element: React.createElement(ProductDetailPage) }));
  const tree = React.createElement(AuthContext.Provider, { value: { currentUser } },
    React.createElement(DataContext.Provider, {
      value: { products, storeInventory: inventory, stores, selectedStoreId, selectStore() {},
        cart: { items: [] }, shoppingNotice: null },
    }, React.createElement(MemoryRouter, { initialEntries: [path] }, routes)));
  return renderToStaticMarkup(tree);
}

test('catalog distinguishes no store, empty store and populated offer', () => {
  assert.match(render('/products', null), /Selecciona una tienda/);
  assert.doesNotMatch(render('/products', null), /\$\s8\.900/);
  assert.match(render('/products', 's001', []), /Sin productos en esta tienda/);
  assert.match(render('/products', 's001'), /\$\s8\.900/);
});

test('detail distinguishes missing ID, no store, not sold and valid offer', () => {
  assert.match(render('/products/missing', 's001'), /Producto no encontrado/);
  assert.match(render('/products/p001', null), /Selecciona una tienda/);
  assert.doesNotMatch(render('/products/p001', null), /\$\s8\.900/);
  assert.match(render('/products/p002', 's002'), /No se vende en esta tienda/);
  assert.match(render('/products/p001', 's001'), /\$\s8\.900/);
});

test('purchase action is only offered to clients on in-stock details', () => {
  const client = demoUsers.find((user) => user.role === 'client');
  const store = demoUsers.find((user) => user.role === 'store_admin');
  assert.match(render('/products/p001', 's001', storeInventory, client), /Agregar al carrito/);
  assert.doesNotMatch(render('/products/p001', 's001'), /Agregar al carrito/);
  assert.doesNotMatch(render('/products/p001', 's001', storeInventory, store), /Agregar al carrito/);
  assert.doesNotMatch(render('/products/p006', 's001', storeInventory, client), /Agregar al carrito/);
  assert.doesNotMatch(render('/products/p001', null, storeInventory, client), /Agregar al carrito/);
  assert.doesNotMatch(render('/products/p002', 's002', storeInventory, client), /Agregar al carrito/);
});

test.after(async () => { await vite.close(); });
