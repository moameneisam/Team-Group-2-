import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import FormInput from './FormInput';
import AlertMessage from './AlertMessage';

function LoginModal({ show, onClose, onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { values, errors, setErrors, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    const nameError = mode === 'register' ? validateName(values.name) : '';

    if (emailError || passwordError || nameError) {
      setErrors({ email: emailError, password: passwordError, name: nameError });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(values.email, values.password);
      } else {
        await register({ name: values.name, email: values.email, password: values.password });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div>
                <h2 className="modal-title h5 fw-bold mb-1">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted small mb-0">
                  {mode === 'login'
                    ? 'Sign in to save your roadmap'
                    : 'Create an account to save your roadmap'}
                </p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body pt-3">
              <AlertMessage message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit} noValidate>
                {mode === 'register' && (
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                )}
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />

                <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                    </>
                  ) : (
                    <>
                      <i className={`bi bi-${mode === 'login' ? 'box-arrow-in-right' : 'person-plus'} me-2`} aria-hidden="true" />
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>
              </form>

              <p className="text-center small mt-3 mb-0" style={{ color: 'var(--text-secondary)' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-decoration-none"
                  onClick={switchMode}
                  style={{ color: 'var(--accent-light)' }}
                >
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>

              {mode === 'login' && (
                <div className="mt-3 p-2 rounded text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <small style={{ color: 'var(--text-muted)' }}>
                    Demo: <code>demo@aisprint.com</code> / <code>demo123</code>
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

export default LoginModal;
