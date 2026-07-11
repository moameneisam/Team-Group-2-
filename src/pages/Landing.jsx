import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTES } from '../utils/config';
import { validateGoal } from '../utils/validation';

function Landing() {
  useDocumentTitle('Plan Smarter with AI');
  const navigate = useNavigate();
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const features = [
    { icon: 'cpu', title: 'AI-Powered Plans', desc: 'Describe your idea and get a full roadmap powered by Google Gemini.' },
    { icon: 'diagram-3', title: 'Smart Architecture', desc: 'Get folder structures, database schemas, and API endpoint designs.' },
    { icon: 'kanban', title: 'Task Management', desc: 'Track progress with To Do, In Progress, and Done statuses.' },
    { icon: 'rocket-takeoff', title: 'Deploy Ready', desc: 'Receive deployment guides and best practices for production.' },
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setError('');
    const goalError = validateGoal(goal);
    if (goalError) {
      setError(goalError);
      return;
    }
    navigate(ROUTES.ROADMAP, { state: { goal } });
  };

  return (
    <div className="landing-page">
      <PublicNavbar />

      <section className="hero-section text-center">
        <div className="container hero-content">
          <div className="hero-badge">
            <i className="bi bi-stars" aria-hidden="true" />
            Powered by Google Gemini AI
          </div>
          <h1 className="hero-title">
            Turn Your Ideas Into<br />
            <span className="gradient-text">Actionable Roadmaps</span>
          </h1>
          <p className="hero-subtitle">
            Describe your project idea — mention any tech you want — and let AI generate
            a complete development plan with tasks, database design, APIs, and more.
          </p>

          <div className="glass-card planner-hero-card">
            <form onSubmit={handleGenerate}>
              <textarea
                className="form-control mb-3"
                rows={4}
                value={goal}
                onChange={(e) => { setGoal(e.target.value); setError(''); }}
                placeholder="e.g. Build a real-time chat app with Go backend and Svelte frontend, or a Flutter mobile app with Firebase..."
                aria-label="Project idea"
              />
              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={!goal.trim()}
              >
                <i className="bi bi-magic" aria-hidden="true" />
                Generate Roadmap
              </button>
              {error && (
                <div className="text-danger small mt-2">
                  <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="text-center h3 fw-bold mb-2">Everything You Need to Ship Faster</h2>
          <p className="text-center mb-5 hero-subtitle mx-auto">
            One AI-powered tool to plan, organize, and launch your next project.
          </p>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-3">
                <div className="glass-card feature-card h-100">
                  <div className="feature-icon">
                    <i className={`bi bi-${f.icon}`} aria-hidden="true" />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 text-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="container py-4">
          <h2 className="h3 fw-bold mb-3">Ready to Build Your Next Project?</h2>
          <p className="mb-4 hero-subtitle mx-auto">
            Start planning now — no account needed to generate your roadmap.
          </p>
          <button
            className="btn btn-primary btn-lg px-5"
            onClick={() => document.querySelector('.planner-hero-card textarea')?.focus()}
          >
            <i className="bi bi-arrow-up me-2" aria-hidden="true" />
            Start Planning
          </button>
        </div>
      </section>

      <footer className="site-footer py-4 text-center small">
        <div className="container">© 2026 AI Sprint. Built with React &amp; Bootstrap.</div>
      </footer>
    </div>
  );
}

export default Landing;
