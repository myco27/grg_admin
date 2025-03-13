import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/layout/DefaultLayout";
import GuestLayout from "./components/layout/GuestLayout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Riders from "./pages/Riders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/userManagement/UserManagementPage";
import AdminManagement from "./pages/adminManagement/AdminManagement";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import EmailCode from "./pages/ForgotPassword/EmailCode";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";

import { useStateContext } from "./contexts/contextProvider";
import RolePermissionTable from "./pages/rolesAndPermissions/RolePermissionTable";
import ProtectedRoute from "./pages/ProtectedRoute";
import UnauthorizedPage from "./components/Views/UnauthorizedPage";

// Wrapper component to handle redirection based on authentication status
const RootRedirect = () => {
  const { token } = useStateContext(); // Get the token from context

  // Redirect to /orders if the user is logged in, otherwise to /admin/login
  return token ? (
    <Navigate to="/user-management" replace />
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        path: "orders",
        element: (
          <ProtectedRoute requiredPermission="view user module">
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:order_id",
        element: (
          <ProtectedRoute requiredPermission="view user module">
            <OrderDetails />
          </ProtectedRoute>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "riders",
        element: (
          <ProtectedRoute requiredPermission="view user module">
            <Riders />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute requiredPermission="view user module">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-management",
        element: (
          <ProtectedRoute requiredPermission="view admin module">
            <AdminManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "roles-and-permissions",
        element: (
          <ProtectedRoute requiredPermission="view roles and permissions module">
            <RolePermissionTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/admin/login", element: <Login /> },
      { path: "/admin/signup", element: <Signup /> },
      { path: "/admin/forgotpassword", element: <ForgotPassword /> },
      { path: "/admin/emailcode", element: <EmailCode /> },
      { path: "/admin/resetpassword", element: <ResetPassword /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;