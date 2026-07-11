import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import SkeletonLoader from '../components/SkeletonLoader';
import LoginModal from '../components/LoginModal';
import RoadmapTabs from '../components/RoadmapTabs';
import AlertMessage from '../components/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { generateProjectPlan } from '../services/geminiService';
import * as projectService from '../services/projectService';
import { ROUTES } from '../utils/config';
import { ensurePlanTasks, updateTaskStatus, applyTaskStatuses } from '../utils/planHelpers';

function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const { isAuthenticated } = useAuth();
  const { saveProject } = useProjects();

  const [activeTab, setActiveTab] = useState('overview');
  const [plan, setPlan] = useState(null);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useDocumentTitle(plan ? plan.title : 'Generating Roadmap…');

  const generatePlan = useCallback(async (g) => {
    setLoading(true);
    setError('');
    setPlan(null);
    setCurrentProjectId(null);

    try {
      const generated = await generateProjectPlan(g);
      setPlan(ensurePlanTasks(generated));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const loadProject = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const project = await projectService.getProjectById(id);
      setGoal(project.goal || '');
      const loadedPlan = applyTaskStatuses(
        ensurePlanTasks(project.plan),
        project.taskStatuses || {}
      );
      setPlan(loadedPlan);
      setCurrentProjectId(project.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
      return;
    }
    if (location.state?.goal) {
      const { goal: g } = location.state;
      setGoal(g);
      generatePlan(g);
      window.history.replaceState({}, document.title);
      return;
    }
    setInitialized(true);
  }, [projectId, location.state, generatePlan, loadProject]);

  const doSave = useCallback(async () => {
    if (!plan) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const saved = await saveProject({
        id: currentProjectId,
        title: plan.title,
        goal,
        summary: plan.summary,
        plan,
        taskStatuses: {},
        isFavorite: false,
      });
      setCurrentProjectId(saved.id);
      setSuccess('Project saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [plan, currentProjectId, goal, saveProject]);

  useEffect(() => {
    if (pendingSave && isAuthenticated && plan) {
      setPendingSave(false);
      setShowLoginModal(false);
      doSave();
    }
  }, [pendingSave, isAuthenticated, plan, doSave]);

  const handleSave = () => {
    if (!plan) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      setPendingSave(true);
      return;
    }
    doSave();
  };

  const handleLoginSuccess = () => {
    setPendingSave(true);
  };

  const handleTaskStatusChange = (taskId, status) => {
    setPlan((prev) => updateTaskStatus(prev, taskId, status));
  };

  if (initialized && !location.state?.goal && !projectId && !plan && !loading) {
    navigate(ROUTES.HOME, { replace: true });
    return null;
  }

  return (
    <div className="roadmap-page">
      <PublicNavbar />

      <div className="container mt-3">
        <AlertMessage message={error} onClose={() => setError('')} />
        <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />
      </div>

      {loading && (
        <div className="container py-4">
          <SkeletonLoader />
        </div>
      )}

      {plan && !loading && (
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">{plan.title}</h1>
              <p className="text-secondary mb-0 small">{plan.summary}</p>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={() => handleSave()}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <i className="bi bi-save" aria-hidden="true" />
                    {currentProjectId ? 'Update' : 'Save Project'}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(ROUTES.HOME)}
              >
                <i className="bi bi-plus-lg me-1" aria-hidden="true" />
                New Plan
              </button>
            </div>
          </div>

          <RoadmapTabs
            plan={plan}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTaskStatusChange={handleTaskStatusChange}
          />
        </div>
      )}

      <LoginModal
        show={showLoginModal}
        onClose={() => { setShowLoginModal(false); setPendingSave(false); }}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default Roadmap;
