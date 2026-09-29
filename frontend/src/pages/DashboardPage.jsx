import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { stores, distributors } from '../data/organizations.js';
import { visibleDestinations } from '../routes/destinations.js';

export default function DashboardPage() {
  const { currentUser, persistenceAvailable } = useAuth();
  const organization = stores.find(({ id }) => id === currentUser.storeId) ??
    distributors.find(({ id }) => id === currentUser.distributorId);
  const shoppingLinks = visibleDestinations(currentUser).filter(({ path }) =>
    ['/products', '/client/cart', '/client/orders'].includes(path));
  const salesLink = visibleDestinations(currentUser).find(({ path }) => path === '/store/sales');
  return (
    <div className="container account-page">
      <section className="account-card" aria-labelledby="dashboard-title">
        <p className="eyebrow">Panel de identidad demo</p>
        <h1 id="dashboard-title">Hola, {currentUser.name}</h1>
        <dl className="identity-details">
          <div><dt>Rol</dt><dd>{currentUser.role}</dd></div>
          {currentUser.subRole && <div><dt>Subrol</dt><dd>{currentUser.subRole}</dd></div>}
          {organization && <div><dt>Organización</dt><dd>{organization.name}</dd></div>}
        </dl>
        <p>Esta sesión y los permisos son una simulación del frontend, no seguridad real.</p>
        {shoppingLinks.length > 1 ? (
          <div className="dashboard-shopping">
            <h2>Compras de demostración</h2>
            <p>Explora una tienda, compra sin cargo real y consulta pedidos de esta sesión.</p>
            <div className="shopping-links">{shoppingLinks.map(({ path, navigation }) => (
              <Link key={path} className="text-link" to={path}>{navigation}</Link>
            ))}</div>
          </div>
        ) : salesLink ? (
          <div className="dashboard-shopping">
            <h2>Ventas de demostración</h2>
            <p>Registra ventas simuladas de tu tienda y consulta su historial de esta sesión.</p>
            <Link className="text-link" to={salesLink.path}>{salesLink.navigation}</Link>
          </div>
        ) : <p>Las funciones comerciales de este rol se incorporarán en cambios posteriores.</p>}
        {!persistenceAvailable && <p role="status">El almacenamiento no está disponible; tu sesión podría no sobrevivir una recarga.</p>}
      </section>
    </div>
  );
}
