import { Link } from 'react-router';

export default function EmptyState({ title, description }) {
  return (
    <section className="empty-state" aria-labelledby="empty-title">
      <p className="eyebrow">En preparación</p>
      <h1 id="empty-title">{title}</h1>
      <p>{description}</p>
      <Link className="text-link" to="/">Volver al inicio <span aria-hidden="true">→</span></Link>
    </section>
  );
}
