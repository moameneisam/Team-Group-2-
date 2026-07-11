import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import AlertMessage from '../components/AlertMessage';
import FormInput from '../components/FormInput';
import { useProjects } from '../context/ProjectContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTES } from '../utils/config';

function Projects() {
  useDocumentTitle('Projects');
  const { projects, loading, removeProject, toggleFavorite, saveProject } = useProjects();
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.goal?.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || p.isFavorite;
    return matchesSearch && matchesFavorite;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await removeProject(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditTitle(project.title);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await saveProject({ ...editingProject, title: editTitle.trim() });
      setEditingProject(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Projects" subtitle="Manage your saved AI-generated plans">
      <AlertMessage message={error} onClose={() => setError('')} />

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" aria-hidden="true" />
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
        </div>
        <div className="form-check form-switch d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="favoritesOnly"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          />
          <label className="form-check-label ms-2" htmlFor="favoritesOnly">
            Favorites only
          </label>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="folder-plus"
          title={projects.length === 0 ? 'No projects yet' : 'No matching projects'}
          description={
            projects.length === 0
              ? 'Generate a plan in the AI Planner and save it here.'
              : 'Try adjusting your search or filters.'
          }
          actionLabel={projects.length === 0 ? 'Open AI Planner' : undefined}
          actionTo={projects.length === 0 ? ROUTES.PLANNER : undefined}
        />
      ) : (
        <div className="row g-4">
          {filtered.map((project) => (
            <div key={project.id} className="col-md-6 col-xl-4">
              <ProjectCard
                project={project}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      )}

      {editingProject && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSaveEdit}>
                <div className="modal-header">
                  <h2 className="modal-title h5">Edit Project</h2>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingProject(null)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <FormInput
                    label="Project Title"
                    name="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingProject(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {editingProject && <div className="modal-backdrop show" />}
    </DashboardLayout>
  );
}

export default Projects;
