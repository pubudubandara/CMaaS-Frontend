import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuth = isAuthenticated();

  if (isAuth) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}