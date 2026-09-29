import FormField from '../common/FormField.jsx';

export default function RegistrationFields({ form, errors, onChange }) {
  return (
    <>
      <FormField label="Nombre" name="name" autoComplete="name" value={form.name}
        onChange={onChange} error={errors.name} />
      <FormField label="Correo electrónico" name="email" type="email" autoComplete="email"
        value={form.email} onChange={onChange} error={errors.email} />
      <FormField label="Contraseña" name="password" type="password" autoComplete="new-password"
        value={form.password} onChange={onChange} error={errors.password} />
      {form.role === 'client' && (
        <FormField label="Confirmar contraseña" name="confirmPassword" type="password"
          autoComplete="new-password" value={form.confirmPassword} onChange={onChange}
          error={errors.confirmPassword} />
      )}
    </>
  );
}
