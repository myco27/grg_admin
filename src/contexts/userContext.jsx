import axiosClient from "../axiosClient";
import { useState, useEffect, useRef } from "react";

const useAuthUser = () => {
  const [userPermission, setUserPermission] = useState({});
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!hasFetched.current) {
          hasFetched.current = true;
          const response = await axiosClient.get("/user");
          
          setUserPermission(response.data.user || {});
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return { user: userPermission };
};

export default useAuthUser;
