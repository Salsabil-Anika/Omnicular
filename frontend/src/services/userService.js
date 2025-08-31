import axios from "axios";
import { getToken } from "./authService";

const API_URL = "http://localhost:5000/api/users";

const config = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getUserProfile = async () => {
  const res = await axios.get(`${API_URL}/me`, config());
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await axios.put(`${API_URL}/me`, data, config());
  return res.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const res = await axios.post(`${API_URL}/me/profile-picture`, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
