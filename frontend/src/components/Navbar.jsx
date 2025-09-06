import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

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

  const handleSignInClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/SignIn');
    } else {
      navigate('/SignIn');
    }
  };

  const handleUploadClick = () => {
    if (!isLoggedIn) {
      navigate('/signin');
    } else {
      navigate('/upload');
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/signin');
    } else {
      navigate('/profile'); 
    }
  };

  return (
    <nav className="navbar">
      <h2 style={{ cursor: 'pointer', margin: 0 }} onClick={() => navigate('/')}>
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
        <button onClick={handleSearch} className="search-button">
          Go
        </button>
      </div>

      <div className="nav-buttons">
        {isLoggedIn && (
          <button onClick={handleProfileClick}>Profile</button>
        )}
        <button onClick={handleUploadClick}>Upload</button>
        <button onClick={handleSignInClick}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
}
