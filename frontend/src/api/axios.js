import axios from "axios";

const api = axios.create({
  baseURL: "https://solid-acorn-pjrvp44qx4r43g4x-8000.app.github.dev/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;