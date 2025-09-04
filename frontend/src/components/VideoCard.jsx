import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link
        to={`/video/${video._id}`}
        className="video-link"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="video-thumbnail">
          <video
            src={`http://localhost:5000${video.videoUrl}`}
            className="video-player"
            preload="metadata"
          />
          <div className="video-overlay">
            <span className="play-icon">▶️</span>
          </div>
        </div>
      </Link>
      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>
        <Link 
          to={`/user/${video.uploadedBy?._id}`} 
          className="video-uploader-link"
          onClick={(e) => e.stopPropagation()}
        >
          {video.uploadedBy?.name || 'Unknown'}
        </Link>
        <div className="video-stats">
          <span className="stat-item">
            <span className="stat-icon">👁️</span>
            {video.views || 0}
          </span>
          <span className="stat-item">
            <span className="stat-icon">👍</span>
            {video.likes?.length || 0}
          </span>
          <span className="stat-item">
            <span className="stat-icon">💬</span>
            {video.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
