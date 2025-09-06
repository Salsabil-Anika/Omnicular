import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginService } from '../services/authService';
import './auth.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginService({ email: email.trim().toLowerCase(), password: password });
      const { token, user } = res;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/upload'); 
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
        <p>New user? <span style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/signup')}>Sign Up</span></p>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}
