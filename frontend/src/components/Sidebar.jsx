import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  
  return (
    <div className="sidebar">
      <a onClick={() => navigate('/profile')}>Profile</a>
      <a onClick={() => navigate('/following')}>Following</a>
      <a onClick={() => navigate('/upload')}>Upload</a>
      <a onClick={() => navigate('/')}>Home</a>
    </div>
  );
}
