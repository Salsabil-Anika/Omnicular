import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get user profile by ID
export const getUserProfileById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update video
export const updateVideo = async (videoId, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/videos/${videoId}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/videos/${videoId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
