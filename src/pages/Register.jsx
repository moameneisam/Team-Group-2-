import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { ROUTES } from '../utils/config';

function Register() {
  useDocumentTitle('Create Account');
  const { register } = useAuth();
  const navigate = useNavigate();

  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    let confirmError = '';
    if (values.password !== values.confirmPassword) {
      confirmError = 'Passwords do not match';
    }

    if (nameError || emailError || passwordError || confirmError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    setLoading(true);
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-vh-100 d-flex flex-column">
      <PublicNavbar />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div className="card border-0 shadow-sm auth-card">
          <div className="card-body p-4 p-md-5">
            <h1 className="h4 fw-semibold text-center mb-1">Create your account</h1>
            <p className="text-muted text-center small mb-4">Start planning projects with AI</p>

            <AlertMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} noValidate>
              <FormInput
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
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
                autoComplete="new-password"
                required
              />
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? <LoadingSpinner size="sm" label="Creating account…" /> : 'Create Account'}
              </button>
            </form>

            <p className="text-center small text-muted mt-4 mb-0">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-decoration-none">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
