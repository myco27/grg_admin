import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const DefaultLayout = () => {
  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </Fragment>
  );
};

export default DefaultLayout;
