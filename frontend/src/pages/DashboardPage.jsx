import { Link } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { stores, distributors } from '../data/organizations.js';
import { visibleDestinations } from '../routes/destinations.js';

export default function DashboardPage() {
  const { currentUser, persistenceAvailable } = useAuth();
  const organization = stores.find(({ id }) => id === currentUser.storeId) ??
    distributors.find(({ id }) => id === currentUser.distributorId);
  const actionLinks = visibleDestinations(currentUser).filter(({ path }) =>
    !['/', '/products', '/login', '/register', '/client/dashboard', '/store/dashboard', '/distributor/dashboard'].includes(path));
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
        <div className="dashboard-shopping"><h2>Funciones de tu rol</h2>
          <p>Estas acciones producen cambios visibles dentro de esta sesión.</p>
          {actionLinks.length ? <div className="shopping-links">{actionLinks.map(({ path, navigation }) => (
            <Link key={path} className="text-link" to={path}>{navigation}</Link>
          ))}</div> : <p>No hay acciones disponibles todavía.</p>}
        </div>
        {!persistenceAvailable && <p role="status">El almacenamiento no está disponible; tu sesión podría no sobrevivir una recarga.</p>}
      </section>
    </div>
  );
}
