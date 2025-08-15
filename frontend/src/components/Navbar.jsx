import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // make sure to create/edit this CSS file

export default function Navbar() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/auth'); // Sign in page
    } else {
      navigate('/auth');
    }
  };

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      navigate('/auth'); // redirect to sign in
    } else {
      navigate('/upload');
    }
  };

  return (
    <nav className="navbar">
      <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Omnicular
      </h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Go</button>
      </div>

      <div className="nav-buttons">
        <button onClick={handleUploadClick}>Upload</button>
        <button onClick={handleAuthClick}>
          {isLoggedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </nav>
  );
}
