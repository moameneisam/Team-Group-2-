import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PlanDisplay from '../components/PlanDisplay';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProjects } from '../context/ProjectContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { generateProjectPlan, chatWithPlanner } from '../services/geminiService';
import { validateGoal } from '../utils/validation';
import * as projectService from '../services/projectService';

function Planner() {
  useDocumentTitle('AI Planner');
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { saveProject } = useProjects();

  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadProject = async (id) => {
    setLoading(true);
    setError('');
    try {
      const project = await projectService.getProjectById(id);
      setGoal(project.goal || '');
      setPlan(project.plan || null);
      setMessages(project.messages || []);
      setCurrentProjectId(project.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const goalError = validateGoal(goal);
    if (goalError) {
      setError(goalError);
      return;
    }

    setLoading(true);
    setPlan(null);
    setMessages([]);

    try {
      const generatedPlan = await generateProjectPlan(goal);
      setPlan(generatedPlan);
      setMessages([
        {
          role: 'assistant',
          content: `I've created a complete plan for "${generatedPlan.title}". Ask me anything about the roadmap, milestones, or next steps!`,
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !plan) return;

    const userMessage = { role: 'user', content: chatInput.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);
    setError('');

    try {
      const reply = await chatWithPlanner(updatedMessages, goal);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message);
      setMessages(messages);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSave = async () => {
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
        messages,
        isFavorite: false,
      });
      setCurrentProjectId(saved.id);
      setSuccess('Project saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNewPlan = () => {
    setGoal('');
    setPlan(null);
    setMessages([]);
    setCurrentProjectId(null);
    setError('');
    setSuccess('');
  };

  return (
    <DashboardLayout title="AI Planner" subtitle="Describe your goal and get a Gemini-powered roadmap">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h6 fw-semibold mb-3">Project Goal</h2>
              <form onSubmit={handleGenerate}>
                <textarea
                  className="form-control mb-3"
                  rows={4}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Build a task management SaaS with React and Node.js..."
                  disabled={loading}
                  aria-label="Project goal"
                />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading || !goal.trim()}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic me-2" aria-hidden="true" />
                        Generate Plan
                      </>
                    )}
                  </button>
                  {plan && (
                    <button type="button" className="btn btn-outline-secondary" onClick={handleNewPlan}>
                      New
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {plan && (
            <div className="card border-0 shadow-sm chat-panel d-flex flex-column">
              <div className="card-header bg-transparent border-0">
                <h2 className="h6 fw-semibold mb-0">
                  <i className="bi bi-chat-dots me-2" aria-hidden="true" />
                  Chat
                </h2>
              </div>
              <div className="chat-messages flex-grow-1 p-3" role="log" aria-live="polite">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-assistant'}`}
                  >
                    {msg.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="chat-bubble chat-assistant">
                    <LoadingSpinner size="sm" label="Thinking…" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleChat} className="p-3 border-top">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your plan…"
                    disabled={chatLoading}
                    aria-label="Chat message"
                  />
                  <button type="submit" className="btn btn-primary" disabled={chatLoading || !chatInput.trim()}>
                    <i className="bi bi-send" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="col-lg-7">
          <AlertMessage message={error} onClose={() => setError('')} />
          <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

          {loading && !plan && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <LoadingSpinner size="lg" label="Gemini is building your roadmap…" />
                <p className="text-muted mt-3 small">This may take 15–30 seconds</p>
              </div>
            </div>
          )}

          {plan && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2" aria-hidden="true" />
                      {currentProjectId ? 'Update Project' : 'Save Project'}
                    </>
                  )}
                </button>
              </div>
              <PlanDisplay plan={plan} />
            </>
          )}

          {!loading && !plan && (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-lightbulb display-4 text-muted mb-3" aria-hidden="true" />
                <h2 className="h5">Ready to plan your project?</h2>
                <p className="text-muted">
                  Enter your project goal on the left and click Generate Plan to get a
                  full roadmap from Google Gemini.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Planner;
