import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("token/", {
    username,
    password,
  });
  if (response.data.access) {
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("username", username);
    localStorage.setItem("role", username === "admin" ? "admin" : "cliente");
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = () => {
  return localStorage.getItem("username") || "cliente";
};

export const getUserRole = () => {
  return localStorage.getItem("role") || (getCurrentUser() === "admin" ? "admin" : "cliente");
};
