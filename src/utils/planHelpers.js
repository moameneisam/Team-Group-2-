import { TASK_STATUSES } from './config';
import { generateId } from './helpers';

export function ensurePlanTasks(plan) {
  if (!plan?.tasks) return plan;
  return {
    ...plan,
    tasks: plan.tasks.map((group) => ({
      ...group,
      items: (group.items || []).map((task, i) => ({
        id: task.id || `task-${generateId()}-${i}`,
        title: task.title,
        description: task.description || '',
        status: task.status === TASK_STATUSES.IN_PROGRESS || task.status === TASK_STATUSES.DONE
          ? task.status
          : TASK_STATUSES.TODO,
      })),
    })),
  };
}

export function applyTaskStatuses(plan, statuses = {}) {
  if (!plan?.tasks) return plan;
  return {
    ...plan,
    tasks: plan.tasks.map((group) => ({
      ...group,
      items: group.items.map((t) => ({
        ...t,
        status: statuses[t.id] || t.status || TASK_STATUSES.TODO,
      })),
    })),
  };
}

export function extractTaskStatuses(plan) {
  const map = {};
  plan?.tasks?.forEach((g) => g.items?.forEach((t) => { if (t.id) map[t.id] = t.status; }));
  return map;
}

export function updateTaskStatus(plan, taskId, status) {
  return {
    ...plan,
    tasks: plan.tasks.map((group) => ({
      ...group,
      items: group.items.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),
  };
}

export function getTaskStats(plan) {
  const items = plan?.tasks?.flatMap((g) => g.items || []) || [];
  return {
    total: items.length,
    todo: items.filter((t) => t.status === TASK_STATUSES.TODO).length,
    inProgress: items.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length,
    done: items.filter((t) => t.status === TASK_STATUSES.DONE).length,
  };
}
