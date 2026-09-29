import ProductCard from './ProductCard.jsx';
import CatalogMessage from './CatalogMessage.jsx';

export default function ProductList({ offers, hasFilters }) {
  if (!offers.length) {
    return hasFilters
      ? <CatalogMessage title="Sin resultados para estos filtros" description="Cambia la búsqueda o la categoría para ver otros productos de esta tienda." />
      : <CatalogMessage title="Sin productos en esta tienda" description="Esta tienda no tiene ofertas registradas en el catálogo demo." />;
  }

  return (
    <div className="product-grid" aria-label="Productos de la tienda seleccionada">
      {offers.map((offer) => <ProductCard key={offer.product.id} offer={offer} />)}
    </div>
  );
}
