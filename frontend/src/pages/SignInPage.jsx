import React, { useState } from 'react';
import axios from 'axios';
import './SignInPage.css';

export default function SignInPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        await axios.post('http://localhost:5000/api/auth/signup', form);
        alert('Registration successful! Please sign in.');
        setIsSignup(false);
        setForm({ name: '', email: '', password: '' });
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/signin', {
          email: form.email,
          password: form.password,
        });
        // Save token & user to localStorage or context
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('Sign in successful!');
        // redirect or reload as needed
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="signin-page">
      <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignup ? 'Register' : 'Sign In'}</button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)} className="toggle-link">
        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}