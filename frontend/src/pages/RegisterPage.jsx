import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import DemoAccess from '../components/auth/DemoAccess.jsx';
import OrganizationFields from '../components/auth/OrganizationFields.jsx';
import RegistrationFields from '../components/auth/RegistrationFields.jsx';
import FormField from '../components/common/FormField.jsx';
import { useAuth } from '../context/useAuth.js';

const roleOptions = [
  { value: 'client', label: 'Cliente' },
  { value: 'store_admin', label: 'Administrador de tienda' },
  { value: 'store_employee', label: 'Empleado de tienda' },
  { value: 'distributor_admin', label: 'Administrador de distribuidor' },
  { value: 'distributor_employee', label: 'Empleado de distribuidor' },
];
const initialForm = { role: 'client', name: '', email: '', password: '', confirmPassword: '',
  storeId: '', distributorId: '', companyCode: '', subRole: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function change(event) {
    const { name, value } = event.target;
    setForm((previous) => name === 'role' ? { ...initialForm, role: value,
      name: previous.name, email: previous.email, password: previous.password } : { ...previous, [name]: value });
    setErrors((previous) => {
      if (name === 'role') return {};
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    const result = register(form);
    // Focus the persistent error summary after an invalid keyboard submission.
    if (!result.ok) { setErrors(result.errors); errorRef.current?.focus(); return; }
    navigate('/login', { replace: true, state: { registrationSuccess: true,
      persistenceWarning: result.persistenceWarning } });
  }

  return (
    <div className="container account-page">
      <section className="account-card" aria-labelledby="register-title">
        <p className="eyebrow">Cuenta de demostración</p>
        <h1 id="register-title">Registrarse</h1>
        <p>Este registro es local y simulado. No uses datos ni contraseñas reales.</p>
        <p className="form-error" role="alert" tabIndex={-1} ref={errorRef}>
          {Object.values(errors).some(Boolean) ? 'Revisa los campos señalados.' : ''}
        </p>
        <form onSubmit={submit} noValidate>
          <FormField label="Tipo de cuenta" name="role" value={form.role} onChange={change}
            error={errors.role} options={roleOptions} />
          <RegistrationFields form={form} errors={errors} onChange={change} />
          <OrganizationFields form={form} errors={errors} onChange={change} />
          <button type="submit">Crear cuenta demo</button>
        </form>
        <p>¿Ya tienes cuenta? <Link className="text-link" to="/login">Ingresar</Link></p>
      </section>
      <DemoAccess />
    </div>
  );
}
