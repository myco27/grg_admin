import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useStateContext();

  if (!user?.all_permissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  const hasPermission = user.all_permissions.some(
    (perm) => perm.name === requiredPermission && perm.status_id === 1
  );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
