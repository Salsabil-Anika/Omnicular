import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  
  return (
    <div className="sidebar">
      <button className="sidebar-link" onClick={() => navigate('/')}>Home</button>
      <button className="sidebar-link" onClick={() => navigate('/upload')}>Upload</button>
      <button className="sidebar-link" onClick={() => navigate('/my-videos')}>My Videos</button>
      <button className="sidebar-link" onClick={() => navigate('/profile')}>Profile</button>
    </div>
  );
}
