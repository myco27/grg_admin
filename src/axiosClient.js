import axios from "axios";
const baseURL = import.meta.env.BASE_URL;


const axiosClient = axios.create({
  // baseURL: baseURL,
  baseURL: "http://localhost/grg_v2/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
 
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
    } else if (response.status === 404) {
    }

    throw error;
  }
);

export default axiosClient;
