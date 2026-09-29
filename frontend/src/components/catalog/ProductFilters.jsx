import FormField from '../common/FormField.jsx';

export default function ProductFilters({ search, onSearch, category, onCategory, categories }) {
  return (
    <div className="catalog-filters" role="search" aria-label="Filtrar productos">
      <FormField label="Buscar por nombre" name="catalog-search" value={search}
        onChange={(event) => onSearch(event.target.value)} type="search" placeholder="Ej. cuaderno" />
      <div className="form-field">
        <label htmlFor="catalog-category">Categoría</label>
        <select id="catalog-category" value={category} onChange={(event) => onCategory(event.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
    </div>
  );
}
