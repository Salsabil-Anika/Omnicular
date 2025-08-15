// src/components/VideoGrid.jsx
import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
