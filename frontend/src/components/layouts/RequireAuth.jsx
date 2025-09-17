import { Navigate } from 'react-router-dom';
import useAuth from '../accounts/useAuth';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default RequireAuth;
