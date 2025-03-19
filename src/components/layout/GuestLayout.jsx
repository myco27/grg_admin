import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";

const GuestLayout = () => {
  const { token } = useStateContext();
  
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </Fragment>
  );
};

export default GuestLayout;
