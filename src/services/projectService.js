import api from './api';

export async function getProjectsByUser(userId) {
  const { data } = await api.get('/projects', {
    params: { userId },
  });
  return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function getProjectById(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function createProject(project) {
  const { data } = await api.post('/projects', {
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return data;
}

export async function updateProject(id, updates) {
  const { data } = await api.patch(`/projects/${id}`, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return data;
}

export async function deleteProject(id) {
  await api.delete(`/projects/${id}`);
}

export async function toggleFavorite(id, isFavorite) {
  return updateProject(id, { isFavorite });
}
