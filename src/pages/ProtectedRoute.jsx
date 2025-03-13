import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Loading from "../components/layout/Loading";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {  
    return <Loading />;
  }

  if (!user?.all_permissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasPermission = user.all_permissions.some((perm) =>
    requiredPermission.includes(perm)
  );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
