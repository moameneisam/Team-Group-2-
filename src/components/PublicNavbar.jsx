import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/config';

function PublicNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg site-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to={ROUTES.HOME}>
          <i className="bi bi-rocket-takeoff text-primary" aria-hidden="true" />
          AI Sprint
        </Link>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi bi-${isDark ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>

          {isAuthenticated ? (
            <>
              <div className="user-chip d-flex align-items-center gap-2">
                <div className="avatar-circle">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="user-chip-text d-none d-sm-flex">
                  <span className="user-chip-label">Signed in as</span>
                  <span className="user-chip-name">{user?.name}</span>
                </div>
              </div>
              <Link to={ROUTES.DASHBOARD} className="btn btn-sm btn-outline-primary">
                <i className="bi bi-speedometer2 me-1" aria-hidden="true" />
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={logout}
                aria-label="Log out"
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                <span className="d-none d-md-inline ms-1">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="btn btn-sm btn-outline-primary">
                Sign In
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
