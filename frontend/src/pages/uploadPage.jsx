import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { uploadVideo } from '../services/videoService';
import './uploadPage.css';

export default function UploadPage({ onVideoUploaded }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a video file!');
    setLoading(true);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const res = await uploadVideo(formData);
      alert('Video uploaded successfully!');
      onVideoUploaded && onVideoUploaded(res); // notify parent
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <Navbar />
      <div className="upload-main">
        <Sidebar />
        <div className="upload-form-container">
          <h2>Upload a Video</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />

            <label>Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
