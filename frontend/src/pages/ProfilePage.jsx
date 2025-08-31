import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "../services/userService";
import { getMyVideos } from "../services/videoService";
import "./ProfilePage.css";

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    <p>Total Videos: {videos.length}</p>
                    {/* You can add more stats here: likes, followers etc. */}
                </div>
            </div>

            {/* UPLOADED VIDEOS */}
            <div className="uploaded-videos">
                <h3>My Uploaded Videos</h3>
                {videos.length === 0 ? (
                    <p>No videos uploaded yet.</p>
                ) : (
                    <div className="videos-grid">
                        {videos.map((video) => (
                            <div key={video._id} className="video-card">
                                <video
                                    src={`http://localhost:5000${video.videoUrl}`}
                                    controls
                                    className="video-preview"
                                />
                                <h4>{video.title}</h4>
                                <p>{video.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
