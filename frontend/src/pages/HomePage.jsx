import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';   // <-- Import Link
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getVideos } from '../services/videoService';
import './HomePage.css';

export default function HomePage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos().then(setVideos).catch(console.error);
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="videos-grid">
          {videos.length === 0 && <p>No videos uploaded yet.</p>}
          {videos.map(video => (
            <Link 
              to={`/video/${video._id}`} 
              key={video._id} 
              className="video-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <video 
                src={`http://localhost:5000${video.videoUrl}`} 
                controls 
                className="video-player"
              />
              <h4 className="video-title">{video.title}</h4>
              <p className="video-description">{video.description || 'No description.'}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
