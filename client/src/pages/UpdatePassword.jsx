import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/update-password', {
        username,
        password
      });
      alert('Password updated!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Update Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            style={styles.input}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: 'linear-gradient(to right, #1c92d2, #f2fcfe)'
  },
  card: {
    background: 'white', padding: '30px', borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center',
    width: '100%', maxWidth: '400px'
  },
  input: {
    width: '100%', padding: '10px', margin: '10px 0',
    borderRadius: '5px', border: '1px solid #ccc'
  },
  button: {
    width: '100%', padding: '10px', backgroundColor: '#1c92d2',
    color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
  }
};
