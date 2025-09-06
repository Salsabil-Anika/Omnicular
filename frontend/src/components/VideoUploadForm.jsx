import React, { useState } from 'react';
import { uploadVideo } from '../services/videoService';

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
      const res = await uploadVideo(formData);

      console.log('Upload response:', res.data);

      alert(res.data.message || 'Upload successful!');


      setTitle('');
      setVideo(null);

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
