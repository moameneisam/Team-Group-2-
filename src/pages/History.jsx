import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useProjects } from '../context/ProjectContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDateTime } from '../utils/helpers';
import { ROUTES } from '../utils/config';

function History() {
  useDocumentTitle('History');
  const { projects, loading } = useProjects();

  const sorted = [...projects].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <DashboardLayout title="History" subtitle="Timeline of all your saved roadmaps">
      {loading ? (
        <LoadingSpinner label="Loading history…" />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon="clock-history"
          title="No history yet"
          description="Your saved projects will appear here."
          actionLabel="Generate Roadmap"
          actionTo={ROUTES.HOME}
        />
      ) : (
        <div className="history-timeline">
          {sorted.map((project) => (
            <div key={project.id} className="glass-card history-item mb-3 p-4">
              <div className="d-flex align-items-start gap-3">
                <div className="history-dot flex-shrink-0">
                  <i className="bi bi-folder2-open" aria-hidden="true" />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <h3 className="h6 fw-semibold mb-1">
                        {project.title}
                        {project.isFavorite && (
                          <i className="bi bi-star-fill text-warning ms-2 small" aria-label="Favorite" />
                        )}
                      </h3>
                      <p className="small text-secondary mb-1">{project.goal}</p>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary-emphasis small">
                      {formatDateTime(project.updatedAt)}
                    </span>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <Link
                      to={`${ROUTES.ROADMAP}?project=${project.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Roadmap
                    </Link>
                    <span className="small text-secondary align-self-center">
                      Created {formatDateTime(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default History;
