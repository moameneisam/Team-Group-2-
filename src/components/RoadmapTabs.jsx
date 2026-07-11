import { TASK_STATUSES, TASK_STATUS_LABELS } from '../utils/config';
import { getTaskStats } from '../utils/planHelpers';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'info-circle' },
  { id: 'roadmap', label: 'Roadmap', icon: 'signpost-split' },
  { id: 'tasks', label: 'Tasks', icon: 'check2-square' },
  { id: 'database', label: 'Database', icon: 'database' },
  { id: 'apis', label: 'APIs', icon: 'plug' },
  { id: 'folder', label: 'Folder Structure', icon: 'folder2-open' },
  { id: 'deployment', label: 'Deployment', icon: 'cloud-upload' },
  { id: 'practices', label: 'Best Practices', icon: 'shield-check' },
];

function TabOverview({ plan }) {
  const stats = getTaskStats(plan);
  return (
    <div>
      <p className="text-secondary mb-4">{plan.summary}</p>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <i className="bi bi-layers text-primary" />
            <div>
              <div className="stat-value">{plan.roadmap?.length || 0}</div>
              <div className="stat-label">Phases</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <i className="bi bi-check2-square text-success" />
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tasks</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <i className="bi bi-clock text-warning" />
            <div>
              <div className="stat-value">{plan.estimatedDuration || '—'}</div>
              <div className="stat-label">Duration</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card">
            <i className="bi bi-code-slash text-info" />
            <div>
              <div className="stat-value">{(plan.techStack || []).length}</div>
              <div className="stat-label">Technologies</div>
            </div>
          </div>
        </div>
      </div>
      {(plan.techStack?.length > 0) && (
        <div className="d-flex flex-wrap gap-2">
          {plan.techStack.map((tech) => (
            <span key={tech} className="badge rounded-pill bg-primary-subtle text-primary-emphasis px-3 py-2">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function TabRoadmap({ plan }) {
  const phases = [...(plan.roadmap || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <div className="row g-3">
      {phases.map((phase, i) => (
        <div key={phase.name || i} className="col-md-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-start gap-3 mb-2">
              <span className="phase-num">{phase.order || i + 1}</span>
              <div>
                <h5 className="mb-1">{phase.name}</h5>
                <span className="badge bg-secondary-subtle text-secondary-emphasis">{phase.duration}</span>
              </div>
            </div>
            <p className="text-secondary mb-0 small">{phase.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabTasks({ plan, onStatusChange }) {
  const cycle = (current) => {
    if (current === TASK_STATUSES.TODO) return TASK_STATUSES.IN_PROGRESS;
    if (current === TASK_STATUSES.IN_PROGRESS) return TASK_STATUSES.DONE;
    return TASK_STATUSES.TODO;
  };

  return (
    <div>
      {(plan.tasks || []).map((group) => (
        <div key={group.phase} className="mb-4">
          <h5 className="mb-3">
            <i className="bi bi-folder2 me-2 text-primary" />
            {group.phase}
          </h5>
          <div className="row g-3">
            {(group.items || []).map((task) => {
              const meta = TASK_STATUS_LABELS[task.status] || TASK_STATUS_LABELS.todo;
              return (
                <div key={task.id} className="col-md-6">
                  <div className="glass-card p-3 h-100 task-card">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h6 className="mb-0">{task.title}</h6>
                      <button
                        type="button"
                        className={`btn btn-sm btn-outline-${meta.color} status-btn`}
                        onClick={() => onStatusChange(task.id, cycle(task.status))}
                        title="Click to change status"
                      >
                        <i className={`bi bi-${meta.icon} me-1`} />
                        {meta.label}
                      </button>
                    </div>
                    <p className="text-secondary small mb-0">{task.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabDatabase({ plan }) {
  const db = plan.database || {};
  return (
    <div>
      <p className="text-secondary mb-4">{db.description}</p>
      <div className="row g-3">
        {(db.tables || []).map((table) => (
          <div key={table.name} className="col-lg-6">
            <div className="glass-card p-4">
              <h5><i className="bi bi-table me-2 text-primary" />{table.name}</h5>
              {table.description && <p className="text-secondary small">{table.description}</p>}
              <div className="table-responsive">
                <table className="table table-sm table-dark-custom mb-0">
                  <thead>
                    <tr><th>Field</th><th>Type</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {(table.fields || []).map((f) => (
                      <tr key={f.name}>
                        <td><code>{f.name}</code></td>
                        <td>{f.type}</td>
                        <td className="text-secondary">{f.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabAPIs({ plan }) {
  const methodColor = (m) => {
    const map = { GET: 'success', POST: 'primary', PUT: 'warning', PATCH: 'info', DELETE: 'danger' };
    return map[m?.toUpperCase()] || 'secondary';
  };
  return (
    <div className="row g-3">
      {(plan.apis || []).map((api, i) => (
        <div key={`${api.path}-${i}`} className="col-md-6">
          <div className="glass-card p-3 d-flex align-items-start gap-3">
            <span className={`badge bg-${methodColor(api.method)}`}>{api.method}</span>
            <div>
              <code className="d-block mb-1">{api.path}</code>
              <p className="text-secondary small mb-0">{api.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabFolderStructure({ plan }) {
  const fs = plan.folderStructure || {};
  return (
    <div>
      <p className="text-secondary mb-4">{fs.description}</p>
      <div className="row g-2">
        {(fs.folders || []).map((folder) => (
          <div key={folder.path} className="col-md-6">
            <div className="glass-card p-3 d-flex gap-3">
              <i className="bi bi-folder-fill text-warning fs-4" />
              <div>
                <code>{folder.path}</code>
                <p className="text-secondary small mb-0">{folder.purpose}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabDeployment({ plan }) {
  const dep = plan.deployment || {};
  return (
    <div className="glass-card p-4">
      <h5><i className="bi bi-cloud-upload me-2 text-primary" />{dep.platform || 'Deployment'}</h5>
      {dep.description && <p className="text-secondary">{dep.description}</p>}
      <ol className="deployment-steps mb-0">
        {(dep.steps || []).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

function TabBestPractices({ plan }) {
  return (
    <div className="row g-3">
      {(plan.bestPractices || []).map((bp, i) => (
        <div key={bp.title || i} className="col-md-6">
          <div className="glass-card p-4 h-100">
            <h6><i className="bi bi-shield-check me-2 text-success" />{bp.title}</h6>
            <p className="text-secondary small mb-0">{bp.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapTabs({ plan, activeTab, onTabChange, onTaskStatusChange }) {
  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <TabOverview plan={plan} />;
      case 'roadmap': return <TabRoadmap plan={plan} />;
      case 'tasks': return <TabTasks plan={plan} onStatusChange={onTaskStatusChange} />;
      case 'database': return <TabDatabase plan={plan} />;
      case 'apis': return <TabAPIs plan={plan} />;
      case 'folder': return <TabFolderStructure plan={plan} />;
      case 'deployment': return <TabDeployment plan={plan} />;
      case 'practices': return <TabBestPractices plan={plan} />;
      default: return null;
    }
  };

  return (
    <div>
      <ul className="nav nav-pills roadmap-tabs mb-4 flex-nowrap overflow-auto pb-1">
        {TABS.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={`bi bi-${tab.icon} me-1`} />
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content-area">{renderTab()}</div>
    </div>
  );
}

export default RoadmapTabs;
