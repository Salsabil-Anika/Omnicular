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
      await axios.post('http://localhost:5000/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTitle('');
      setVideo(null);
      onUploadSuccess();
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Upload Video</h3>
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
