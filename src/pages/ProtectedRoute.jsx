import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/contextProvider";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useStateContext();

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
