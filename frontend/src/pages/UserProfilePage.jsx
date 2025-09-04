import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfileById, updateVideo, deleteVideo } from '../services/userProfileService';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploaded');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchUserProfile();
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfileById(id);
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const isOwnProfile = currentUser && profileData?.user?._id === currentUser._id;

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setEditFormData({
      title: video.title,
      description: video.description
    });
  };

  const handleSaveVideo = async () => {
    try {
      const updatedVideo = await updateVideo(editingVideo._id, editFormData);
      setProfileData(prev => ({
        ...prev,
        videos: prev.videos.map(v => v._id === editingVideo._id ? updatedVideo : v)
      }));
      setEditingVideo(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await deleteVideo(videoId);
        setProfileData(prev => ({
          ...prev,
          videos: prev.videos.filter(v => v._id !== videoId)
        }));
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="user-profile-loading">Loading...</div>;
  if (!profileData) return <div className="user-profile-error">User not found.</div>;

  const { user, videos, likedVideos, stats } = profileData;

  return (
    <div className="user-profile-page">
      {/* PROFILE HEADER */}
      <div className="user-profile-header">
        <div className="user-profile-info">
          <div className="user-profile-avatar-container">
            <img
              src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "/default-avatar.png"}
              alt="profile"
              className="user-profile-avatar"
            />
          </div>

          <div className="user-profile-details">
            <h2>{user.name || "No Name"}</h2>
            <p className="user-bio">{user.bio || "No bio available."}</p>
            {user.birthday && (
              <p className="user-birthday">
                Birthday: {new Date(user.birthday).toDateString()}
              </p>
            )}
            {isOwnProfile && (
              <Link to="/profile" className="edit-profile-link">
                Edit My Profile
              </Link>
            )}
          </div>
        </div>

        <div className="user-profile-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.uploadedCount}</span>
            <span className="stat-label">Uploaded Videos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.likedCount}</span>
            <span className="stat-label">Liked Videos</span>
          </div>
        </div>
      </div>

      {/* VIDEO TABS */}
      <div className="video-tabs">
        <button 
          className={`tab-btn ${activeTab === 'uploaded' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploaded')}
        >
          Uploaded Videos ({videos.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          Liked Videos ({likedVideos.length})
        </button>
      </div>

      {/* VIDEOS SECTION */}
      <div className="videos-section">
        {activeTab === 'uploaded' ? (
          <div className="uploaded-videos">
            <h3>Uploaded Videos</h3>
            {videos.length === 0 ? (
              <div className="empty-state">
                <p>No videos uploaded yet.</p>
              </div>
            ) : (
              <div className="videos-grid">
                {videos.map((video) => (
                  <div key={video._id} className="video-card">
                    {editingVideo && editingVideo._id === video._id ? (
                      <div className="video-edit-form">
                        <input
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditFormChange}
                          className="video-edit-input"
                          placeholder="Video title"
                        />
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          className="video-edit-textarea"
                          placeholder="Video description"
                          rows="3"
                        />
                        <div className="video-edit-actions">
                          <button 
                            onClick={handleSaveVideo}
                            className="save-video-btn"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setEditingVideo(null);
                              setEditFormData({});
                            }}
                            className="cancel-video-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link to={`/video/${video._id}`} className="video-link">
                          <div className="video-thumbnail">
                            <video
                              src={`http://localhost:5000${video.videoUrl}`}
                              className="video-preview"
                              preload="metadata"
                            />
                            <div className="video-overlay">
                              <span className="play-icon">▶️</span>
                            </div>
                          </div>
                        </Link>
                        <div className="video-info">
                          <h4>{video.title}</h4>
                          <p>{video.description}</p>
                          <div className="video-stats">
                            <span>👁️ {video.views || 0} views</span>
                            <span>👍 {video.likes?.length || 0}</span>
                            <span>💬 {video.comments?.length || 0}</span>
                          </div>
                          {isOwnProfile && (
                            <div className="video-actions">
                              <button 
                                className="edit-video-btn"
                                onClick={() => handleEditVideo(video)}
                              >
                                Edit
                              </button>
                              <button 
                                className="delete-video-btn"
                                onClick={() => handleDeleteVideo(video._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="liked-videos">
            <h3>Liked Videos</h3>
            {likedVideos.length === 0 ? (
              <div className="empty-state">
                <p>No liked videos yet.</p>
              </div>
            ) : (
              <div className="videos-grid">
                {likedVideos.map((video) => (
                  <div key={video._id} className="video-card">
                    <Link to={`/video/${video._id}`} className="video-link">
                      <div className="video-thumbnail">
                        <video
                          src={`http://localhost:5000${video.videoUrl}`}
                          className="video-preview"
                          preload="metadata"
                        />
                        <div className="video-overlay">
                          <span className="play-icon">▶️</span>
                        </div>
                      </div>
                    </Link>
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <p>{video.description}</p>
                      <div className="video-stats">
                        <span>👁️ {video.views || 0} views</span>
                        <span>👍 {video.likes?.length || 0}</span>
                        <span>💬 {video.comments?.length || 0}</span>
                      </div>
                      <div className="video-uploader">
                        <Link to={`/user/${video.uploadedBy._id}`} className="uploader-link">
                          By: {video.uploadedBy.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
