import apiClient from '../api';

export const login = async (username, password) => {
  const response = await apiClient.post('login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
