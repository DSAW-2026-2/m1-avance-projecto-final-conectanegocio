import { canAccess, getDashboardPath } from './permissions.js';

export function routeDecision(user, destination) {
  if (!destination?.requiresAuth || !destination.path) return { kind: 'unavailable' };
  if (!user) return { kind: 'redirect', to: '/login' };
  if (canAccess(user, destination)) return { kind: 'render' };
  const ownDashboard = getDashboardPath(user.role);
  if (ownDashboard === '/' || ownDashboard === destination.path) return { kind: 'unavailable' };
  return { kind: 'redirect', to: ownDashboard };
}
