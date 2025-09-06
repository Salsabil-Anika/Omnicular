import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toggleVideoReaction, addComment, shareVideo } from '../services/videoInteractionService';
import './VideoPlayerPage.css';

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
      setVideo(res.data);
      setLikesCount(res.data.likes?.length || 0);
      setDislikesCount(res.data.dislikes?.length || 0);
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        setUserLiked(res.data.likes?.includes(currentUser._id) || false);
        setUserDisliked(res.data.dislikes?.includes(currentUser._id) || false);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleReaction = async (action) => {
    try {
      const result = await toggleVideoReaction(id, action);
      setLikesCount(result.likes);
      setDislikesCount(result.dislikes);
      setUserLiked(result.userLiked);
      setUserDisliked(result.userDisliked);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await addComment(id, commentText);
      setVideo(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareVideo(id);
      setShareMessage(result.message);
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  if (loading) return <div className="video-player-loading">Loading...</div>;
  if (!video) return <div className="video-player-error">Video not found.</div>;

  return (
    <div className="video-player-container">
      <div className="video-player-main">
        <div className="video-player-header">
          <h1 className="video-title">{video.title}</h1>
          <div className="video-stats">
            <span className="views-count">{video.views || 0} views</span>
            <span className="upload-date">
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="video-player-wrapper">
          <video 
            className="video-player" 
            controls 
            autoPlay={false}
            preload="metadata"
          >
            <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-actions">
          <div className="action-buttons">
            <button 
              className={`action-btn like-btn ${userLiked ? 'active' : ''}`}
              onClick={() => handleReaction('like')}
            >
              <span className="action-icon">👍</span>
              <span className="action-count">{likesCount}</span>
            </button>
            
            <button 
              className={`action-btn dislike-btn ${userDisliked ? 'active' : ''}`}
              onClick={() => handleReaction('dislike')}
            >
              <span className="action-icon">👎</span>
              <span className="action-count">{dislikesCount}</span>
            </button>

            <button 
              className="action-btn share-btn"
              onClick={handleShare}
            >
              <span className="action-icon">📤</span>
              <span>Share</span>
            </button>
          </div>

          {shareMessage && (
            <div className="share-message">
              {shareMessage}
            </div>
          )}
        </div>

        <div className="video-info">
          <div className="uploader-info">
            <img 
              src={video.uploadedBy?.profilePicture ? `http://localhost:5000${video.uploadedBy.profilePicture}` : "/default-avatar.png"} 
              alt="Uploader" 
              className="uploader-avatar"
            />
            <Link 
              to={`/user/${video.uploadedBy?._id}`} 
              className="uploader-name-link"
            >
              {video.uploadedBy?.name || 'Unknown'}
            </Link>
          </div>
          
          <div className="video-description">
            <p>{video.description || 'No description available.'}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({video.comments?.length || 0})</h3>
          
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="comment-input"
              rows="3"
            />
            <button type="submit" className="comment-submit-btn">
              Comment
            </button>
          </form>

          <div className="comments-list">
            {video.comments?.length > 0 ? (
              video.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <img 
                      src={comment.userProfilePicture ? `http://localhost:5000${comment.userProfilePicture}` : "/default-avatar.png"} 
                      alt="User" 
                      className="comment-avatar"
                    />
                    <div className="comment-info">
                      <Link 
                        to={`/user/${comment.user}`} 
                        className="comment-username-link"
                      >
                        {comment.username}
                      </Link>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
