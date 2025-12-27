import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = (e) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-reset-link', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="grid-overlay"></div>

      <div className="forgot-container">
        <h2>Forgot Password</h2>

        {!confirmed ? (
          <form onSubmit={handleConfirm}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Is this you?</button>
          </form>
        ) : (
          <form onSubmit={handleSendLink}>
            <p>We will send a reset link to <b>{email}</b></p>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {msg && <p className="forgot-msg">{msg}</p>}

        <div className="forgot-footer">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
