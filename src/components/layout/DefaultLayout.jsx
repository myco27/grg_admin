import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useStateContext } from "../../contexts/contextProvider";
import Sidebar from "./Sidebar";

const DefaultLayout = () => {
  const {token, sidebarCollapsed} = useStateContext();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-gray-100 group">
        <Sidebar />
        
        <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          <Header />
          
          <main className="flex-1">
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </div>
    </Fragment>
  );
};

export default DefaultLayout;
