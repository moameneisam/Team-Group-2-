function PlanDisplay({ plan }) {
  if (!plan) return null;

  return (
    <div className="plan-display">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 fw-semibold">{plan.title}</h2>
          <p className="text-muted mb-0">{plan.summary}</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <SectionCard title="Roadmap" icon="signpost-split">
            <div className="timeline">
              {plan.roadmap?.map((phase, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-marker">{i + 1}</div>
                  <div className="timeline-content">
                    <h3 className="h6 mb-1">{phase.phase}</h3>
                    <span className="badge text-bg-primary-subtle text-primary-emphasis mb-2">
                      {phase.duration}
                    </span>
                    <p className="small text-muted mb-0">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-lg-6">
          <SectionCard title="Milestones" icon="flag">
            <ul className="list-group list-group-flush">
              {plan.milestones?.map((m, i) => (
                <li key={i} className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="small">{m.title}</strong>
                    <span className="badge text-bg-secondary-subtle">{m.target}</span>
                  </div>
                  <p className="small text-muted mb-0 mt-1">{m.criteria}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="col-12">
          <SectionCard title="Weekly Plan" icon="calendar-week">
            <div className="row g-3">
              {plan.weeklyPlan?.map((week) => (
                <div key={week.week} className="col-md-6 col-lg-3">
                  <div className="week-card h-100 p-3 rounded border">
                    <div className="fw-semibold small text-primary">Week {week.week}</div>
                    <div className="fw-medium small mt-1">{week.focus}</div>
                    <ul className="small text-muted mt-2 mb-0 ps-3">
                      {week.tasks?.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-lg-6">
          <SectionCard title="Resources" icon="book">
            <div className="list-group list-group-flush">
              {plan.resources?.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action px-0"
                >
                  <div className="d-flex justify-content-between">
                    <strong className="small">{r.name}</strong>
                    <span className="badge text-bg-info-subtle">{r.type}</span>
                  </div>
                  <p className="small text-muted mb-0">{r.description}</p>
                </a>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="col-lg-6">
          <SectionCard title="Project Structure" icon="diagram-3">
            <p className="small text-muted">{plan.projectStructure?.description}</p>
            {plan.projectStructure?.techStack && (
              <div className="mb-3">
                {plan.projectStructure.techStack.map((tech, i) => (
                  <span key={i} className="badge text-bg-primary me-1 mb-1">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <ul className="list-unstyled small mb-0">
              {plan.projectStructure?.folders?.map((f, i) => (
                <li key={i} className="mb-2">
                  <code className="text-primary">{f.path}</code>
                  <span className="text-muted ms-2">— {f.purpose}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0 pt-3 pb-0">
        <h3 className="h6 fw-semibold mb-0">
          <i className={`bi bi-${icon} me-2 text-primary`} aria-hidden="true" />
          {title}
        </h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default PlanDisplay;
