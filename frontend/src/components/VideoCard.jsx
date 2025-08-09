// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="video-card">
        <video width="320" height="180" controls>
          <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p>{video.title}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
