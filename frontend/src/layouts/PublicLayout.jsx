import { useRef } from 'react';
import { NavLink, Outlet } from 'react-router';
import { productName } from '../config/branding.js';
import SiteNavigation from '../components/common/SiteNavigation.jsx';

export default function PublicLayout() {
  const mainRef = useRef(null);

  function skipToContent(event) {
    // HashRouter owns the fragment; a native #main-content link would replace the route.
    event.preventDefault();
    mainRef.current?.focus();
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" onClick={skipToContent}>Saltar al contenido</a>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink className="brand" to="/" aria-label={`${productName}, ir al inicio`}>
            <span className="brand-mark" aria-hidden="true">CN</span>
            <span>{productName}</span>
          </NavLink>
          <SiteNavigation />
        </div>
      </header>
      <main className="site-main" id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">{productName} · Prototipo frontend académico</div>
      </footer>
    </div>
  );
}
