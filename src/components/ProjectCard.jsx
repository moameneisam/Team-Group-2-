import { Link } from 'react-router-dom';
import { formatDate, truncate } from '../utils/helpers';
import { ROUTES } from '../utils/config';

function ProjectCard({ project, onDelete, onToggleFavorite, onEdit }) {
  return (
    <div className="card border-0 shadow-sm h-100 project-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="h6 fw-semibold mb-0">{project.title}</h3>
          <button
            type="button"
            className={`btn btn-sm btn-link p-0 ${project.isFavorite ? 'text-warning' : 'text-muted'}`}
            onClick={() => onToggleFavorite(project.id, !project.isFavorite)}
            aria-label={project.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`bi bi-star${project.isFavorite ? '-fill' : ''}`} aria-hidden="true" />
          </button>
        </div>
        <p className="small text-muted flex-grow-1">{truncate(project.summary || project.goal, 100)}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <span className="small text-muted">{formatDate(project.updatedAt)}</span>
          <div className="btn-group btn-group-sm">
            <Link to={`${ROUTES.PLANNER}?project=${project.id}`} className="btn btn-outline-primary">
              View
            </Link>
            <button type="button" className="btn btn-outline-secondary" onClick={() => onEdit(project)}>
              Edit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(project.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
