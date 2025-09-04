import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "../services/userService";
import { getMyVideos } from "../services/videoService";
import { getLikedVideos } from "../services/videoInteractionService";
import { updateVideo, deleteVideo } from "../services/userProfileService";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('uploaded'); // 'uploaded' or 'liked'
    const [editingVideo, setEditingVideo] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch user info
                const data = await getUserProfile();
                const userData = data.user || data;
                setUser(userData);
                setFormData(userData);

                // Fetch user's uploaded videos
                const myVideos = await getMyVideos();
                setVideos(myVideos);

                // Fetch user's liked videos
                const likedVids = await getLikedVideos();
                setLikedVideos(likedVids);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const saveProfile = async () => {
        try {
            // Update basic info
            const updatedResponse = await updateUserProfile(formData);
            const updatedUser = updatedResponse.user || updatedResponse;
            setUser(updatedUser);

            // Upload profile picture if selected
            if (file) {
                const updatedPicResponse = await uploadProfilePicture(file);
                const updatedUserWithPic = updatedPicResponse.user || updatedPicResponse;
                setUser(updatedUserWithPic);
                setFile(null);
            }

            setEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

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
            setVideos(videos.map(v => v._id === editingVideo._id ? updatedVideo : v));
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
                setVideos(videos.filter(v => v._id !== videoId));
            } catch (error) {
                console.error('Error deleting video:', error);
            }
        }
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="profile-page">
            {/* PROFILE HEADER */}
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar-container">
                        <img
                            src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "/default-avatar.png"}
                            alt="profile"
                            className="profile-avatar"
                        />
                    </div>

                    {editing ? (
                        <>
                            <input
                                name="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                className="profile-input"
                                placeholder="Your Name"
                            />
                            <input
                                name="birthday"
                                type="date"
                                value={formData.birthday ? formData.birthday.substring(0, 10) : ""}
                                onChange={handleChange}
                                className="profile-input"
                            />
                            <textarea
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleChange}
                                className="profile-textarea"
                                placeholder="Your bio"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="profile-file-input"
                            />
                            <button onClick={saveProfile} className="profile-save-btn">Save</button>
                        </>
                    ) : (
                        <>
                            <h2>{user.name || "No Name"}</h2>
                            <p>{user.birthday ? new Date(user.birthday).toDateString() : "No Birthday"}</p>
                            <p>{user.bio || "No Bio"}</p>
                            <button onClick={() => setEditing(true)} className="profile-edit-btn">Edit Profile</button>
                        </>
                    )}
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{videos.length}</span>
                        <span className="stat-label">Uploaded Videos</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{likedVideos.length}</span>
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
                    My Uploaded Videos ({videos.length})
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
                        <h3>My Uploaded Videos</h3>
                        {videos.length === 0 ? (
                            <div className="empty-state">
                                <p>No videos uploaded yet.</p>
                                <p>Start sharing your content!</p>
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
                                                <video
                                                    src={`http://localhost:5000${video.videoUrl}`}
                                                    controls
                                                    className="video-preview"
                                                />
                                                <h4>{video.title}</h4>
                                                <p>{video.description}</p>
                                                <div className="video-stats">
                                                    <span>👁️ {video.views || 0} views</span>
                                                    <span>👍 {video.likes?.length || 0}</span>
                                                    <span>💬 {video.comments?.length || 0}</span>
                                                </div>
                                                <div className="video-actions">
                                                    <button 
                                                        onClick={() => handleEditVideo(video)}
                                                        className="edit-video-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteVideo(video._id)}
                                                        className="delete-video-btn"
                                                    >
                                                        Delete
                                                    </button>
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
                                <p>Like some videos to see them here!</p>
                            </div>
                        ) : (
                            <div className="videos-grid">
                                {likedVideos.map((video) => (
                                    <div key={video._id} className="video-card">
                                        <video
                                            src={`http://localhost:5000${video.videoUrl}`}
                                            controls
                                            className="video-preview"
                                        />
                                        <h4>{video.title}</h4>
                                        <p>{video.description}</p>
                                        <div className="video-stats">
                                            <span>👁️ {video.views || 0} views</span>
                                            <span>👍 {video.likes?.length || 0}</span>
                                            <span>💬 {video.comments?.length || 0}</span>
                                        </div>
                                        <div className="video-uploader">
                                            <span>By: {video.uploadedBy?.name || 'Unknown'}</span>
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
