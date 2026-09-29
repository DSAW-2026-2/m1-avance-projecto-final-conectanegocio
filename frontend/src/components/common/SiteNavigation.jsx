import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth.js';
import { useData } from '../../context/useData.js';
import { visibleDestinations } from '../../routes/destinations.js';

export default function SiteNavigation() {
  const { currentUser, logout } = useAuth();
  const { clearCartForLogout } = useData();
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  function signOut() {
    clearCartForLogout();
    const result = logout();
    setWarning(result.persistenceWarning ? 'No se pudo guardar el cierre de sesión; podría reaparecer al recargar.' : '');
    navigate('/login', { replace: true });
  }

  return (
    <>
      <nav className="site-nav" aria-label="Navegación principal">
        {visibleDestinations(currentUser).map(({ path, navigation }) => (
          <NavLink key={path} to={path} end={path === '/'}>{navigation}</NavLink>
        ))}
        {currentUser && <button className="nav-button" type="button" onClick={signOut}>Salir</button>}
      </nav>
      {warning && <p className="nav-warning" role="status">{warning}</p>}
    </>
  );
}
