import FormField from '../common/FormField.jsx';

export default function SupplierFilters({ products, productId, onProduct, sort, onSort }) {
  return <div className="catalog-filters">
    <FormField label="Producto a comparar" name="supplier-product" value={productId} onChange={onProduct}
      options={products.map(({ id, name }) => ({ value: id, label: name }))} />
    <FormField label="Ordenar ofertas" name="supplier-sort" value={sort} onChange={onSort}
      options={[{ value: 'price', label: 'Menor precio' }, { value: 'delivery', label: 'Entrega rápida' }, { value: 'stock', label: 'Más stock' }]} />
  </div>;
}
