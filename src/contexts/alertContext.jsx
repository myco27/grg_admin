import React, { createContext, useState, useContext, useEffect } from "react";

const alertContext = createContext();

export function useAlert() {
  return useContext(alertContext);
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setFadeOut(false);
    setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <alertContext.Provider value={{ alert, showAlert }}>
      {children}
      {alert && (
        <div
          className={`fixed bottom-4 left-4 z-50 text-white p-4 rounded-lg shadow-lg transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          } ${getBackgroundColor(alert.type)}`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              <i
                className={`fas ${
                  alert.type === "success"
                    ? "fa-check-circle"
                    : "fa-exclamation-circle"
                }`}
              ></i>
            </span>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
    </alertContext.Provider>
  );
}
