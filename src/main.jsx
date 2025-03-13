import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router.jsx";
import "./index.css";
import { ContextProvider } from "./contexts/contextProvider";
import { AlertProvider } from "./contexts/alertContext";

const favicon = document.getElementById("favicon");
if (favicon) {
  favicon.href = import.meta.env.VITE_APP_LOGO;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ContextProvider>
  </StrictMode>
);
