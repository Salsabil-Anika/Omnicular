import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const getToken = () => localStorage.getItem("token");
