import axios from "axios";
import cookies from "js-cookie";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = cookies.get("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

  // TODO: refactorizar para el httponly
});
