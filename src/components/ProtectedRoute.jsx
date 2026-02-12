import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoading } from './Loading';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Check role requirements
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default ProtectedRoute;
