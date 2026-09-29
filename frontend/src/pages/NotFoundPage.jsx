import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="container page-center">
      <section className="empty-state" aria-labelledby="not-found-title">
        <p className="eyebrow">Página no encontrada</p>
        <h1 id="not-found-title">No encontramos esta página</h1>
        <p>Esta ruta no está disponible en el prototipo actual.</p>
        <Link className="text-link" to="/">Volver al inicio <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
