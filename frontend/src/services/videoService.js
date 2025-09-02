// src/services/videoService.js
import axios from 'axios';
import { getToken } from './authService';
const API_URL = 'http://localhost:5000/api/videos';

export const uploadVideo = (formData) => axios.post(API_URL, formData, {
  headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${getToken()}` }
});
export const getVideos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
export const updateVideo = (id, formData) => axios.put(`${API_URL}/${id}`, formData, {
  headers: { Authorization: `Bearer ${getToken()}` }
});
export const deleteVideo = (id) => {
  return axios.delete(`http://localhost:5000/api/videos/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
export const searchVideos = async (query) => {
  const res = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

export const getMyVideos = async () => {
  const res = await axios.get(`${API_URL}/my-videos`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.data;
};
