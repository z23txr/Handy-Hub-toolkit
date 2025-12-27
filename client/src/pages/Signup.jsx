import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="auth-input" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="auth-input" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="auth-input" required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="auth-input" required />
          <button className="auth-button" type="submit">Sign Up</button>
        </form>
        {msg && <p className="auth-msg">{msg}</p>}
        <p className="auth-text">Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
      </div>
    </div>
  );
}
