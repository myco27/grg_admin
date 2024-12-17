import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isAuthenticated }) {
  // If the user is authenticated, render the child routes using <Outlet />
  // Otherwise, redirect to the home page using <Navigate />
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
