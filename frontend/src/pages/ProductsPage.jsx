import { useState } from 'react';
import { useData } from '../context/useData.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { filterOffers, getCategories, getStoreOffers } from '../utils/catalog.js';
import StoreSelector from '../components/catalog/StoreSelector.jsx';
import ProductFilters from '../components/catalog/ProductFilters.jsx';
import ProductList from '../components/catalog/ProductList.jsx';
import CatalogMessage from '../components/catalog/CatalogMessage.jsx';

export default function ProductsPage() {
  const { products, storeInventory, stores, selectedStoreId, selectStore, cart, shoppingNotice } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);
  const selectedStore = stores.find(({ id }) => id === selectedStoreId);
  const offers = getStoreOffers(selectedStoreId, products, storeInventory, stores);
  const categories = getCategories(offers);
  const visibleOffers = filterOffers(offers, debouncedSearch, category);

  function changeStore(storeId) {
    selectStore(storeId);
    if (!cart.items.length || cart.storeId === storeId) setCategory('');
  }

  return (
    <div className="container catalog-page">
      <header className="catalog-intro">
        <p className="eyebrow">Catálogo público · Datos de demostración</p>
        <h1>Productos por tienda</h1>
        <p>Elige una tienda para consultar sus precios y existencias. La disponibilidad es simulada.</p>
      </header>
      <div className="catalog-toolbar">
        <StoreSelector stores={stores} selectedStoreId={selectedStoreId} onSelect={changeStore} notice={shoppingNotice} />
        {selectedStore && offers.length > 0 && (
          <ProductFilters search={search} onSearch={setSearch} category={category}
            onCategory={setCategory} categories={categories} />
        )}
      </div>
      {!selectedStore ? (
        <CatalogMessage title="Selecciona una tienda" description="Los precios y las existencias dependen de la tienda elegida." />
      ) : (
        <section className="catalog-results" aria-label={`Catálogo de ${selectedStore.name}`}>
          <div className="catalog-results-heading">
            <h2>{selectedStore.name}</h2>
            <p>{visibleOffers.length} {visibleOffers.length === 1 ? 'producto mostrado' : 'productos mostrados'}</p>
          </div>
          <ProductList offers={visibleOffers} hasFilters={offers.length > 0 && Boolean(debouncedSearch.trim() || category)} />
        </section>
      )}
    </div>
  );
}
