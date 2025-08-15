import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getVideos, updateVideo, deleteVideo } from '../services/videoService';


const VideoList = ({ refresh }) => {
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/videos/my-videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  const handleEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/videos/${id}`, { title: editedTitle });
      setEditingId(null);
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    await deleteVideo(id);
    fetchVideos();
  };


  return (
    <div>
      <h3>Uploaded Videos</h3>

      {videos.map((video) => (
        <div key={video._id} style={{ marginBottom: 20 }}>
          {editingId === video._id ? (
            <>
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <button onClick={() => handleEdit(video._id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <>
                <p><strong>{video.title}</strong></p>
                <video width="320" controls>
                  <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <br />
                <button
                  onClick={() => {
                    setEditingId(video._id);
                    setEditedTitle(video.title);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{ marginLeft: '10px', color: 'red' }}
                  onClick={() => handleDelete(video._id)}
                >
                  Delete
                </button>
              </>

            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoList;
