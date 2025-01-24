import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useStateContext } from "../../contexts/contextProvider";

const DefaultLayout = () => {
  const {token} = useStateContext();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </Fragment>
  );
};

export default DefaultLayout;
