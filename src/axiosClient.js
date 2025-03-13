import axios from "axios";

// baseURL from .env
// = import.meta.env.VITE_BASE_URL;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const baseURL = 'http://127.0.0.1:8000/api';

const axiosClient = axios.create({
  baseURL: baseURL,
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
