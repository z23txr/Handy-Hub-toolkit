import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [captcha, setCaptcha] = useState('');
  const [msg, setMsg] = useState('');
  const expectedCaptcha = '7'; // Example static captcha (3+4)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captcha !== expectedCaptcha) {
      setMsg("Captcha incorrect");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setMsg('Login successful!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-in">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" onChange={handleChange} className="auth-input" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="auth-input" required />
          <input placeholder="Captcha: What is 3 + 4?" value={captcha} onChange={(e) => setCaptcha(e.target.value)} className="auth-input" required />
          <button className="auth-button" type="submit">Login</button>
        </form>
        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>
        <p className="auth-text">Don’t have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
        {msg && <p className="auth-msg">{msg}</p>}
      </div>
    </div>
  );
}
