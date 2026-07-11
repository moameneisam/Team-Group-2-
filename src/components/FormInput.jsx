function FormInput({
  label,
  id,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  as = 'input',
  rows = 3,
  readOnly = false,
}) {
  const inputId = id || name;
  const isInvalid = !!error;

  const commonProps = {
    id: inputId,
    name,
    value: value ?? '',
    onChange,
    placeholder,
    required,
    autoComplete,
    className: `form-control${isInvalid ? ' is-invalid' : ''}`,
    'aria-invalid': isInvalid,
    'aria-describedby': isInvalid ? `${inputId}-error` : undefined,
    readOnly,
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}

export default FormInput;
