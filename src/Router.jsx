import React from "react";
import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/layout/DefaultLayout";

import Orders from "./pages/Orders";
import Riders from "./pages/Riders";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/orders",
                element: <Orders />,
            },
            {
                path: "/riders",
                element: <Riders />,
            },
        ],
    },
    // {
    //     path: "/",
    //     element: <GuestLayout />,
    //     children: [
    //         {
    //             path: "/login",
    //             element: <Login />,
    //         },
    //         {
    //             path: "/signup",
    //             element: <Signup />,
    //         },
    //     ],
    // },

    // {
    //     path: "*",
    //     element: <NotFound />,
    // },
]);

export default router;
