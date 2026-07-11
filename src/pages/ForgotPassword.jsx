import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateEmail, validatePassword } from '../utils/validation';
import { requestPasswordReset, resetPassword } from '../services/authService';
import { ROUTES } from '../utils/config';

function ForgotPassword() {
  useDocumentTitle('Forgot Password');
  const [step, setStep] = useState('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const { values, errors, setErrors, handleChange, resetForm } = useForm({
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  });

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailError = validateEmail(values.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset(values.email);
      setResetToken(result.token);
      setSuccess(`${result.message} Token: ${result.token}`);
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = validatePassword(values.password);
    let confirmError = '';
    if (values.password !== values.confirmPassword) {
      confirmError = 'Passwords do not match';
    }
    if (!values.token?.trim()) {
      setErrors({ token: 'Reset token is required', password: passwordError, confirmPassword: confirmError });
      return;
    }
    if (passwordError || confirmError) {
      setErrors({ password: passwordError, confirmPassword: confirmError });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(values.email, values.token, values.password);
      setSuccess(result.message);
      resetForm({ email: values.email, token: '', password: '', confirmPassword: '' });
      setStep('done');
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
            <h1 className="h4 fw-semibold text-center mb-1">Reset password</h1>
            <p className="text-muted text-center small mb-4">
              {step === 'request' && 'Enter your email to receive a reset token'}
              {step === 'reset' && 'Enter the token and your new password'}
              {step === 'done' && 'Your password has been updated'}
            </p>

            <AlertMessage message={error} onClose={() => setError('')} />
            <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

            {step === 'request' && (
              <form onSubmit={handleRequestReset} noValidate>
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
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" label="Sending…" /> : 'Send Reset Token'}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} noValidate>
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  readOnly
                />
                <FormInput
                  label="Reset Token"
                  name="token"
                  value={values.token || resetToken}
                  onChange={handleChange}
                  error={errors.token}
                  placeholder="Paste your reset token"
                  required
                />
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
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
                  autoComplete="new-password"
                  required
                />
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <LoadingSpinner size="sm" label="Updating…" /> : 'Update Password'}
                </button>
              </form>
            )}

            {step === 'done' && (
              <Link to={ROUTES.LOGIN} className="btn btn-primary w-100">
                Go to Sign In
              </Link>
            )}

            <p className="text-center small text-muted mt-4 mb-0">
              <Link to={ROUTES.LOGIN} className="text-decoration-none">Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
