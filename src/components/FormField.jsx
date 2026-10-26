function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}) {
  return (
    <label className="login-field">
      <span>
        {label}
        {required && ' *'}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <small>{error}</small>}
    </label>
  )
}

export default FormField
