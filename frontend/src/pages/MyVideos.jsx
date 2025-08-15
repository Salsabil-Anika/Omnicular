import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
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
        <div className="my-videos-page">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div style={{ flex: 1, padding: '20px' }}>
                    <h2>My Videos</h2>
                    <VideoGrid videos={videos} />
                </div>
            </div>
        </div>
    );
}
