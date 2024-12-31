import React from "react";
import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/layout/DefaultLayout";
import GuestLayout from "./components/layout/GuestLayout";

import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Riders from "./pages/Riders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
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
      // {
      //   path: "/signup",
      //   element: <Signup />,
      // },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
