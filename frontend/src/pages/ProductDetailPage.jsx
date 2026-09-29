import { Link, useParams } from 'react-router';
import { useData } from '../context/useData.js';
import { getProductDetail } from '../utils/catalog.js';
import StoreSelector from '../components/catalog/StoreSelector.jsx';
import ProductOfferDetails from '../components/catalog/ProductOfferDetails.jsx';
import CatalogMessage from '../components/catalog/CatalogMessage.jsx';
import AddToCartAction from '../components/catalog/AddToCartAction.jsx';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { products, storeInventory, stores, selectedStoreId, selectStore, shoppingNotice } = useData();
  const detail = getProductDetail(productId, selectedStoreId, products, storeInventory, stores);
  const selectedStore = stores.find(({ id }) => id === selectedStoreId);

  if (detail.kind === 'not-found') {
    return (
      <div className="container catalog-page">
        <h1>Producto no encontrado</h1>
        <CatalogMessage title="No encontramos ese producto" description="Comprueba el enlace o vuelve a explorar las ofertas disponibles." backToCatalog />
      </div>
    );
  }

  return (
    <div className="container catalog-page product-detail-page">
      <Link className="text-link" to="/products">← Volver al catálogo</Link>
      <header className="catalog-intro">
        <p className="eyebrow">{detail.product.category} · Datos de demostración</p>
        <h1>{detail.product.name}</h1>
        <p>{detail.product.description}</p>
      </header>
      <div className="product-detail-layout">
        <div className="catalog-toolbar">
          <StoreSelector stores={stores} selectedStoreId={selectedStoreId} onSelect={selectStore} notice={shoppingNotice} />
          <p>La disponibilidad y el precio cambian según la tienda seleccionada.</p>
        </div>
        {detail.kind === 'select-store' && (
          <CatalogMessage title="Selecciona una tienda" description="Elige una tienda para consultar su precio y sus existencias." />
        )}
        {detail.kind === 'not-sold' && (
          <CatalogMessage title="No se vende en esta tienda" description={`${selectedStore.name} no ofrece este producto. Puedes elegir otra tienda.`} />
        )}
        {detail.kind === 'offered' && (
          <div>
            <ProductOfferDetails store={selectedStore} inventoryItem={detail.inventoryItem} availability={detail.availability} />
            <AddToCartAction key={productId} productId={productId} quantity={detail.inventoryItem.quantity} />
          </div>
        )}
      </div>
    </div>
  );
}
