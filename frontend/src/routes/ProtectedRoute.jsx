import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { routeDecision } from '../utils/routeAccess.js';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function ProtectedRoute({ destination, children }) {
  const { currentUser } = useAuth();
  const decision = routeDecision(currentUser, destination);
  if (decision.kind === 'redirect') return <Navigate to={decision.to} replace />;
  if (decision.kind === 'unavailable') return <NotFoundPage />;
  return children;
}
