import { Link } from 'react-router';

export default function CatalogMessage({ title, description, backToCatalog = false }) {
  return (
    <section className="catalog-message" aria-label={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      {backToCatalog && <Link className="text-link" to="/products">Volver al catálogo <span aria-hidden="true">→</span></Link>}
    </section>
  );
}
