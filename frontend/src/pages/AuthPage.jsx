import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async () => {
    if (isRegister) {
      await registerUser(form);
    } else {
      await loginUser(form);
    }
    window.location.href = '/';
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      {isRegister && (
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit}>
        {isRegister ? 'Register' : 'Login'}
      </button>
      <p onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Login' : 'No account? Register'}
      </p>
    </div>
  );
}
