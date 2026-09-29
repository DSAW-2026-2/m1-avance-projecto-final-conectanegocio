import { Link } from 'react-router';
import { productName } from '../config/branding.js';

export default function HomePage() {
  return (
    <div className="container home-page">
      <section className="hero" aria-labelledby="home-title">
        <p className="eyebrow">Prototipo frontend · En construcción</p>
        <h1 id="home-title">{productName}</h1>
        <p className="hero-copy">
          Explora productos y precios de demostración por tienda.
          Los clientes pueden comprar y el personal autorizado puede registrar ventas simuladas en esta sesión.
        </p>
        <div className="hero-actions">
          <Link className="button-link" to="/products">Explorar el catálogo</Link>
          <Link className="text-link" to="/login">Ingresar al demo <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="foundation-note" aria-labelledby="foundation-title">
        <p className="eyebrow">Esta entrega</p>
        <h2 id="foundation-title">Funciones disponibles en esta sesión</h2>
        <p>
          El acceso, el catálogo, las compras de clientes y las ventas de tienda son demostraciones locales.
          Las demás funciones comerciales se incorporarán en cambios posteriores.
        </p>
      </section>
    </div>
  );
}
