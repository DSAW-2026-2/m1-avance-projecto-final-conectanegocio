import { Navigate } from 'react-router';
import { useAuth } from '../context/useAuth.js';
import { getDashboardPath } from '../utils/permissions.js';

export default function AccountEntryRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to={getDashboardPath(currentUser.role)} replace /> : children;
}
