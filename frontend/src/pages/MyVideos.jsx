import React, { useEffect, useState } from 'react';
import VideoGrid from '../components/VideoGrid';
import axios from 'axios';

export default function MyVideos() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchMyVideos = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/videos/my-videos', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setVideos(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch your videos');
            }
        };

        fetchMyVideos();
    }, []);

    return (
        <div className="my-videos-page" style={{ padding: '20px' }}>
            <h2>My Videos</h2>
            <VideoGrid videos={videos} />
        </div>
    );
}
