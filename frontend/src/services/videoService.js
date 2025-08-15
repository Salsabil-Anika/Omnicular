// src/services/videoService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

export const uploadVideo = (formData) => axios.post(API_URL, formData);
export const getVideos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
export const updateVideo = (id, formData) => axios.put(`${API_URL}/${id}`, formData);
export const deleteVideo = (id) => {
  return axios.delete(`http://localhost:5000/api/videos/${id}`);
};
export const searchVideos = async (query) => {
  const res = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

