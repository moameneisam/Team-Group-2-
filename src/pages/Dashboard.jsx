import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useProjects } from '../context/ProjectContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate, truncate } from '../utils/helpers';
import { ROUTES } from '../utils/config';

function Dashboard() {
  useDocumentTitle('Dashboard');
  const { projects, favorites, loading, searchProjects, toggleFavorite, removeProject } = useProjects();
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filtered = searchProjects(query);
  const recentProjects = projects.slice(0, 5);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await removeProject(id);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'folder', color: 'primary' },
    { label: 'Favorites', value: favorites.length, icon: 'star', color: 'warning' },
    { label: 'Recent', value: recentProjects.length, icon: 'clock-history', color: 'success' },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Your saved AI roadmaps">
      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div key={stat.label} className="col-md-4">
            <div className="glass-card stat-card p-3">
              <div className="d-flex align-items-center gap-3">
                <div className={`stat-icon bg-${stat.color}-subtle text-${stat.color}`}>
                  <i className={`bi bi-${stat.icon}`} aria-hidden="true" />
                </div>
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
          <h2 className="h5 fw-bold mb-0">Saved Roadmaps</h2>
          <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '420px' }}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-secondary-subtle">
                <i className="bi bi-search" aria-hidden="true" />
              </span>
              <input
                type="search"
                className="form-control bg-transparent border-secondary-subtle"
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search projects"
              />
            </div>
            <Link to={ROUTES.HOME} className="btn btn-primary text-nowrap">
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              New
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading projects…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="folder-plus"
            title={query ? 'No matches found' : 'No projects yet'}
            description={query ? 'Try a different search term.' : 'Generate a roadmap and save it to see it here.'}
            actionLabel="Generate Roadmap"
            actionTo={ROUTES.HOME}
          />
        ) : (
          <div className="row g-3">
            {filtered.map((p) => (
              <div key={p.id} className="col-md-6 col-xl-4">
                <div className="glass-card project-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 className="h6 fw-bold mb-0">{p.title}</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-warning"
                      onClick={() => toggleFavorite(p.id, !p.isFavorite)}
                      aria-label={p.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <i className={`bi bi-star${p.isFavorite ? '-fill' : ''}`} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-secondary small flex-grow-1">{truncate(p.goal || p.summary, 100)}</p>
                  <div className="text-secondary small mb-3">{formatDate(p.updatedAt)}</div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`${ROUTES.ROADMAP}?project=${p.id}`}
                      className="btn btn-sm btn-primary flex-grow-1"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      aria-label="Delete project"
                    >
                      {deletingId === p.id ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                      ) : (
                        <i className="bi bi-trash" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="h5 fw-bold mb-3">
            <i className="bi bi-star-fill text-warning me-2" aria-hidden="true" />
            Favorites
          </h2>
          <div className="row g-3">
            {favorites.map((p) => (
              <div key={p.id} className="col-md-6">
                <Link to={`${ROUTES.ROADMAP}?project=${p.id}`} className="text-decoration-none">
                  <div className="glass-card p-3 d-flex align-items-center gap-3 project-card">
                    <i className="bi bi-folder2-open text-primary fs-4" aria-hidden="true" />
                    <div>
                      <div className="fw-semibold">{p.title}</div>
                      <div className="text-secondary small">{formatDate(p.updatedAt)}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
