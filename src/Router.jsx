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
import Dashboard from "./pages/dashboard/Dashboard";
import ApplicationsPage from "./pages/applicationsManagement/ApplicationsPage";
import Settings from "./pages/settingsTable/settings";
import RestaurantManagement from "./pages/restaurantManagement/RestaurantManagementPage";
import Configuration from "./pages/Configuration/Configuration";
import TermsAndConditions from "./pages/Configuration/TermsAndConditions";
import AboutUs from "./pages/Configuration/AboutUs";
import PrivacyPolicy from "./pages/Configuration/PrivacyPolicies";
import FreeItems from "./pages/freeItemsManagement/FreeItems";
import AdminFreeItems from "./pages/freeItemsManagement/adminFreeItems/AdminFreeItems";
import PromoItems from "./pages/freeItemsManagement/promotional/PromoItems";
import ClaimedFreeItems from "./pages/freeItemsManagement/adminFreeItems/ClaimedFreeItems";
import Invoices from "./pages/invoiceManagement/Invoices";
import StoreGroup from "./pages/storeGroupManagement/StoreGroup";

// Wrapper component to handle redirection based on authentication status
const RootRedirect = () => {
  const { token } = useStateContext(); // Get the token from context

  // Redirect to /orders if the user is logged in, otherwise to /admin/login
  return token ? (
    <Navigate to="/dashboard" replace />
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
        path: "dashboard",
        element: (
          <ProtectedRoute requiredPermission="view dashboard module">
            <Dashboard />
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
        path: "applications",
        element: (
          <ProtectedRoute requiredPermission="view application module">
            <ApplicationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute requiredPermission="view settings module">
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "restaurant-management",
        element: (
          <ProtectedRoute requiredPermission="view restaurant module">
            <RestaurantManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuration/privacypolicy",
        element: (
          <ProtectedRoute requiredPermission="view configuration module">
            <PrivacyPolicy />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuration/termsandconditions",
        element: (
          <ProtectedRoute requiredPermission="view configuration module">
            <TermsAndConditions />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuration/aboutus",
        element: (
          <ProtectedRoute requiredPermission="view configuration module">
            <AboutUs />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuration",
        element: (
          <ProtectedRoute requiredPermission="view configuration module">
            <Configuration />
          </ProtectedRoute>
        ),
      },
      {
        path: "free-items",
        element: (
          <ProtectedRoute requiredPermission="view free items">
            <FreeItems />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/free-items",
        element: (
          <ProtectedRoute requiredPermission="view free items">
            <AdminFreeItems />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions/free-items",
        element: (
          <ProtectedRoute requiredPermission="view free items">
            <PromoItems />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions/free-items/:promotionId",
        element: (
          <ProtectedRoute requiredPermission="view free items">
            <ClaimedFreeItems />
          </ProtectedRoute>
        ),
      },
      {
        path: "invoice-management",
        element: (
          <ProtectedRoute requiredPermission="view invoice module">
            <Invoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "store-group",
        element: (
          <ProtectedRoute requiredPermission="view store group module">
            <StoreGroup />
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
