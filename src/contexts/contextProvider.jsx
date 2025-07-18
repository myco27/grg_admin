import { createContext, useContext, useState } from "react";
import axiosClient from "../axiosClient";

const stateContext = createContext({
  user: null,
  token: null,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  setSidebarCollapsed: () => {},
  setMobileMenuOpen: () => {},
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, _setUser] = useState(() => {
    const storedUser = localStorage.getItem("USER");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const setUser = (user) => {
    _setUser(user);
    if (user) {
      localStorage.setItem("USER", JSON.stringify(user));
    } else {
      localStorage.removeItem("USER");
    }
  };

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/user");
      _setUser(response.data.user);
    } catch (err) {
      _setUser(null);
    }
  };

  return (
    <stateContext.Provider
      value={{
        user,
        token,
        sidebarCollapsed,
        mobileMenuOpen,
        setSidebarCollapsed,
        setMobileMenuOpen,
        setUser,
        setToken,
        fetchUser,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
