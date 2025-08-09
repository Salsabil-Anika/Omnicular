import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found.</p>;

  return (
    <div>
      <h2>{video.title}</h2>
      <video width="600" controls>
        <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{video.description || 'No description.'}</p>
    </div>
  );
}
