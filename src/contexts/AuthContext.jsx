import { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "../axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get("/user");

      setUser(response.data.user);

      localStorage.removeItem("USER");
      localStorage.setItem("USER", JSON.stringify(response.data.user));
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
