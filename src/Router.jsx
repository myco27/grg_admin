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

import { useStateContext } from "./contexts/contextProvider";
import RolePermissionTable from "./pages/rolesAndPermissions/RolePermissionTable";

// Wrapper component to handle redirection based on authentication status
const RootRedirect = () => {
  const { token } = useStateContext(); // Get the token from context

  // Redirect to /orders if the user is logged in, otherwise to /admin/login
  return token ? <Navigate to="/orders" replace /> : <Navigate to="/admin/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/:order_id",
        element: <OrderDetails />,
        errorElement: <NotFound />,
      },
      {
        path: "riders",
        element: <Riders />,
      },
      {
        path: "riders/:riderId",
        element: <Riders />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "admin-management",
        element: <AdminManagement />,
      },
      {
        path: "roles-and-permissions",
        element: <RolePermissionTable />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/admin/login",
        element: <Login />,
      },
      {
        path: "/admin/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;