import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/video/${video._id}`}
      className="video-card"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <video
        src={`http://localhost:5000${video.videoUrl}`}
        controls
        className="video-player"
      />
      <h4 className="video-title">{video.title}</h4>
      <p className="video-uploader">
        {video.uploadedBy?.name || 'Unknown'}
      </p>
    </Link>
  );
}
