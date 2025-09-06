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

// Like/Dislike video
export const toggleVideoReaction = async (videoId, action) => {
  try {
    const response = await axios.post(
      `${API_URL}/videos/${videoId}/like`,
      { action },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add comment
export const addComment = async (videoId, text) => {
  try {
    const response = await axios.post(
      `${API_URL}/videos/${videoId}/comment`,
      { text },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get liked videos
export const getLikedVideos = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/videos/liked-videos`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Share video (copy link to clipboard)
export const shareVideo = async (videoId) => {
  const videoUrl = `${window.location.origin}/video/${videoId}`;
  try {
    await navigator.clipboard.writeText(videoUrl);
    return { success: true, message: 'Video link copied to clipboard!' };
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = videoUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return { success: true, message: 'Video link copied to clipboard!' };
  }
};
