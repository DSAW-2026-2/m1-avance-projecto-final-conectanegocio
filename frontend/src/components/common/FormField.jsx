export default function FormField({ label, name, value, onChange, error, options, ...inputProps }) {
  const errorId = `${name}-error`;
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {options ? (
        <select id={name} name={name} value={value} onChange={onChange}
          aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
          <option value="">Selecciona una opción</option>
          {options.map(({ value: optionValue, label: optionLabel }) => (
            <option key={optionValue} value={optionValue}>{optionLabel}</option>
          ))}
        </select>
      ) : (
        <input id={name} name={name} value={value} onChange={onChange}
          aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...inputProps} />
      )}
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}
