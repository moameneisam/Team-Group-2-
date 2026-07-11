import { Link } from 'react-router-dom';

function EmptyState({ icon = 'inbox', title, description, actionLabel, actionTo }) {
  return (
    <div className="text-center py-5">
      <i className={`bi bi-${icon} display-4 text-muted`} aria-hidden="true" />
      <h3 className="h5 mt-3">{title}</h3>
      {description && <p className="text-muted mb-4">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
