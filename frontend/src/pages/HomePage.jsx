import React, { useState, useEffect } from 'react';
import { getVideos } from '../services/videoService';
import VideoGrid from '../components/VideoGrid';
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
      <VideoGrid videos={filteredVideos} />
    </div>
  );
}
