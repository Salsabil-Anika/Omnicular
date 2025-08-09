import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getVideos } from '../services/videoService';
import './HomePage.css';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data);
        setFilteredVideos(data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(
        videos.filter((video) =>
          video.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="homepage">
      <Navbar onSearch={handleSearch} />
      <div className="main-content">
        <Sidebar />
        <div className="videos-grid">
          {filteredVideos.length === 0 && <p>No videos found.</p>}
          {filteredVideos.map((video) => (
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
              <p className="video-description">
                {video.description || 'No description.'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
