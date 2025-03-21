import { Fragment, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { ArrowUp } from "lucide-react";
import { useStateContext } from "../../contexts/contextProvider";
import Sidebar from "./Sidebar";
import { Tooltip } from "@material-tailwind/react";

const DefaultLayout = () => {
  const { token, sidebarCollapsed } = useStateContext();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <Fragment>
      <div className="min-h-screen bg-gray-100 group">
        <Sidebar />

        <div
          className={`flex flex-col min-h-screen transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          <Header />

          <main className="flex-1">
            <Outlet />
          </main>

          <Footer />
        </div>
        {/* Back to Top Button */}
        {showScroll && (
          <Tooltip content="Back to Top">
            <button
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 text-white bg-primary p-2 rounded-full transition-all duration-300"
            >
              <ArrowUp />
            </button>
          </Tooltip>
        )}
      </div>
    </Fragment>
  );
};

export default DefaultLayout;
