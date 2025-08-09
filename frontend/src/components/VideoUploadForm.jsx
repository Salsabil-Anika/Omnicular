import React, { useState } from 'react';
import axios from 'axios';

const VideoUploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video) return alert('Please provide title and video');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);

    try {
      const res = await axios.post('http://localhost:5000/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Upload response:', res.data);

      // ✅ Show backend message
      alert(res.data.message || 'Upload successful!');

      // ✅ Clear form if successful
      setTitle('');
      setVideo(null);

      // ✅ Let parent know upload finished
      if (onUploadSuccess) onUploadSuccess(res.data.video);

    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 id="upload-message">Share your Video</h3>
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default VideoUploadForm;
