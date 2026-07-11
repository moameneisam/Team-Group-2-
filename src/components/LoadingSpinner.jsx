function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  const sizeClass = size === 'lg' ? 'spinner-border-lg' : size === 'sm' ? 'spinner-border-sm' : '';

  return (
    <div className="text-center" role="status" aria-live="polite">
      <div className={`spinner-border text-primary ${sizeClass}`} aria-hidden="true" />
      {label && <span className="visually-hidden">{label}</span>}
      {size === 'lg' && label && <p className="text-muted mt-3 mb-0">{label}</p>}
    </div>
  );
}

export default LoadingSpinner;
