import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomePath } from '../../lib/roles';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function RoleRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner className="min-h-[40vh]" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return children;
}
