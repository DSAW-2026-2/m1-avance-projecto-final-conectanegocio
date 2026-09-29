import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import FormField from '../components/common/FormField.jsx';
import DemoAccess from '../components/auth/DemoAccess.jsx';
import { useAuth } from '../context/useAuth.js';
import { getDashboardPath } from '../utils/permissions.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const errorRef = useRef(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const registered = location.state?.registrationSuccess;

  function change(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError('');
  }

  function submit(event) {
    event.preventDefault();
    const result = login(form.email, form.password);
    // Focus the persistent error summary so keyboard users hear the failed submission.
    if (!result.ok) { setError(result.message); errorRef.current?.focus(); return; }
    navigate(getDashboardPath(result.user.role), { replace: true });
  }

  return (
    <div className="container account-page">
      <section className="account-card" aria-labelledby="login-title">
        <p className="eyebrow">Acceso de demostración</p>
        <h1 id="login-title">Ingresar</h1>
        <p>Este ingreso funciona solo en tu navegador. No uses credenciales reales.</p>
        {registered && <p className="form-success" role="status">Cuenta creada. Ingresa para continuar.</p>}
        {location.state?.persistenceWarning && <p role="status">El almacenamiento está deshabilitado; la cuenta podría no sobrevivir una recarga.</p>}
        <p className="form-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>
        <form onSubmit={submit} noValidate>
          <FormField label="Correo electrónico" name="email" type="email" autoComplete="username"
            value={form.email} onChange={change} />
          <FormField label="Contraseña" name="password" type="password" autoComplete="current-password"
            value={form.password} onChange={change} />
          <button type="submit">Ingresar</button>
        </form>
        <p>¿No tienes cuenta? <Link className="text-link" to="/register">Registrarse</Link></p>
      </section>
      <DemoAccess />
    </div>
  );
}
