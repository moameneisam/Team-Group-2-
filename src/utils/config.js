export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  USER: 'aisprint_user',
  THEME: 'aisprint_theme',
  DRAFT_PLAN: 'aisprint_draft_plan',
};

export const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
];

export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const TASK_STATUS_LABELS = {
  todo: { label: 'To Do', icon: 'circle', color: 'secondary' },
  in_progress: { label: 'In Progress', icon: 'hourglass-split', color: 'warning' },
  done: { label: 'Done', icon: 'check-circle-fill', color: 'success' },
};

export const ROUTES = {
  HOME: '/',
  ROADMAP: '/roadmap',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
  SETTINGS: '/settings',
};
