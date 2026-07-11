import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateEmail, validatePassword } from '../utils/validation';
import { ROUTES } from '../utils/config';

function Login() {
  useDocumentTitle('Sign In');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const { values, errors, setErrors, handleChange } = useForm({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
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
            <h1 className="h4 fw-semibold text-center mb-1">Welcome back</h1>
            <p className="text-muted text-center small mb-4">Sign in to your AI Sprint account</p>

            <AlertMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} noValidate>
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
                autoComplete="current-password"
                required
              />

              <div className="d-flex justify-content-end mb-3">
                <Link to={ROUTES.FORGOT_PASSWORD} className="small text-decoration-none">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center small text-muted mt-4 mb-0">
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-decoration-none">Create one</Link>
            </p>

            <div className="mt-3 p-2 rounded bg-body-tertiary text-center">
              <small className="text-muted">
                Demo: <code>demo@aisprint.com</code> / <code>demo123</code>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
