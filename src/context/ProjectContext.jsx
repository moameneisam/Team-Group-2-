import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as projectService from '../services/projectService';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectsByUser(user.id);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [isAuthenticated, user?.id, fetchProjects]);

  const saveProject = useCallback(async (projectData) => {
    const payload = { ...projectData, userId: user.id };
    const saved = projectData.id
      ? await projectService.updateProject(projectData.id, payload)
      : await projectService.createProject(payload);
    await fetchProjects();
    return saved;
  }, [user?.id, fetchProjects]);

  const removeProject = useCallback(async (id) => {
    await projectService.deleteProject(id);
    await fetchProjects();
  }, [fetchProjects]);

  const toggleFavorite = useCallback(async (id, isFavorite) => {
    await projectService.toggleFavorite(id, isFavorite);
    await fetchProjects();
  }, [fetchProjects]);

  const searchProjects = useCallback((query) => {
    if (!query?.trim()) return projects;
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.goal?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q)
    );
  }, [projects]);

  const favorites = projects.filter((p) => p.isFavorite);

  const value = {
    projects,
    favorites,
    loading,
    error,
    fetchProjects,
    saveProject,
    removeProject,
    toggleFavorite,
    searchProjects,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}
