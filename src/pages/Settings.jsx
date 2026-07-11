import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateName, validateEmail } from '../utils/validation';

function Settings() {
  useDocumentTitle('Settings');
  const { user, updateProfile } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const nameError = validateName(profile.name);
    const emailError = validateEmail(profile.email);
    if (nameError || emailError) {
      setProfileErrors({ name: nameError, email: emailError });
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name: profile.name.trim(), email: profile.email.trim().toLowerCase() });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your profile and appearance">
      <AlertMessage message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h2 className="h6 fw-semibold mb-0">
                <i className="bi bi-person me-2" aria-hidden="true" />
                Profile
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileSave}>
                <FormInput
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  error={profileErrors.name}
                  required
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h2 className="h6 fw-semibold mb-0">
                <i className="bi bi-palette me-2" aria-hidden="true" />
                Theme
              </h2>
            </div>
            <div className="card-body">
              <p className="small text-muted mb-3">
                Current theme: <strong>{isDark ? 'Dark' : 'Light'}</strong>
              </p>
              <div className="btn-group" role="group" aria-label="Theme selection">
                <button
                  type="button"
                  className={`btn btn-outline-secondary${theme === 'light' ? ' active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <i className="bi bi-sun me-1" aria-hidden="true" />
                  Light
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-secondary${theme === 'dark' ? ' active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <i className="bi bi-moon me-1" aria-hidden="true" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
