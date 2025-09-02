import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Layout now provided by App Shell
import axios from 'axios';
import { uploadVideo as uploadVideoService } from '../services/videoService';
import './uploadPage.css';

export default function UploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !title) return alert('Title and video are required');

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    const token = localStorage.getItem('token');
    if (!token) return navigate('/signin');

    setLoading(true);
    try {
      const res = await uploadVideoService(formData);
      alert('Upload successful!');
      navigate('/my-videos');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
      } else {
        alert(err.response?.data?.message || 'Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} required />
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  );
}
