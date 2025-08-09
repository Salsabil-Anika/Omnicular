import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Omnicular
      </h2>

      <input
        type="text"
        placeholder="Search videos..."
        onChange={(e) => onSearch(e.target.value)}
      />

      <div>
        <button onClick={() => navigate('/upload')}>Upload</button>
        <button onClick={() => navigate('/auth')}>Sign In</button>
      </div>
    </nav>
  );
}
