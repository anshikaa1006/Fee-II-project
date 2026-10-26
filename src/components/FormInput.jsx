function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  autoComplete = 'off',
  inputMode,
  maxLength,
}) {
  const errorId = `${name}-error`
  const inputClassName = `${className} ${error ? 'has-error' : ''}`.trim()

  return (
    <div className={`form-input-field ${inputClassName}`}>
      <label htmlFor={name}>{label}{required ? ' *' : ''}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <small id={errorId} className="form-input-error">{error}</small>}
    </div>
  )
}

export default FormInput
