import FormField from '../common/FormField.jsx';

export default function StoreSelector({ stores, selectedStoreId, onSelect, notice }) {
  return (
    <><FormField
      label="Tienda para consultar precios y disponibilidad"
      name="catalog-store"
      value={selectedStoreId ?? ''}
      onChange={(event) => onSelect(event.target.value)}
      options={stores.map(({ id, name }) => ({ value: id, label: name }))}
    />
      {notice?.kind === 'store-error' && <p className="form-error" role="alert">{notice.message}</p>}
    </>
  );
}
