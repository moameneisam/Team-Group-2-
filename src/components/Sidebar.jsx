import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/config';

const navItems = [
  { to: ROUTES.DASHBOARD, icon: 'speedometer2', label: 'Dashboard' },
  { to: ROUTES.HISTORY, icon: 'clock-history', label: 'History' },
  { to: ROUTES.SETTINGS, icon: 'gear', label: 'Settings' },
];

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <aside className="sidebar d-flex flex-column">
      <div className="sidebar-brand px-3 py-4">
        <Link to={ROUTES.DASHBOARD} className="text-decoration-none d-flex align-items-center gap-2">
          <span className="brand-icon">
            <i className="bi bi-rocket-takeoff" aria-hidden="true" />
          </span>
          <span className="brand-text fw-bold">AI Sprint</span>
        </Link>
      </div>

      <div className="px-3 mb-3">
        <Link to={ROUTES.HOME} className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
          <i className="bi bi-magic" aria-hidden="true" />
          New Roadmap
        </Link>
      </div>

      <nav className="flex-grow-1 px-2" aria-label="Main navigation">
        <ul className="nav nav-pills flex-column gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.to} className="nav-item">
                <Link
                  to={item.to}
                  className={`nav-link d-flex align-items-center gap-2${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <i className={`bi bi-${item.icon}`} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer p-3 border-top">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="avatar-circle">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1 min-w-0">
            <div className="fw-semibold text-truncate small">{user?.name}</div>
            <div className="text-secondary text-truncate" style={{ fontSize: '0.75rem' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary flex-grow-1"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi bi-${isDark ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger flex-grow-1"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
