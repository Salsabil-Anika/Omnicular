// src/services/videoService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/videos';

export const uploadVideo = (formData) => axios.post(API_URL, formData);
export const getVideos = () => axios.get(API_URL);
export const updateVideo = (id, formData) => axios.put(`${API_URL}/${id}`, formData);
