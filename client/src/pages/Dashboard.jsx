// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const tools = [
  { name: 'URL Shortener', image: '/icons/url.png', link: '/url-shortener' },
  { name: 'QR Generator', image: '/icons/qr.png', link: '/qr-generator' },
  { name: 'Image Caption', image: '/icons/image.png', link: '/image-caption' },
  { name: 'Weather Forecast', image: '/icons/weather.png', link: '/weather' },
  { name: 'Voice to Text', image: '/icons/voice.png', link: '/voice-to-text' },
  { name: 'Currency Converter', image: '/icons/currency.png', link: '/currency-converter' },
];

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <button className="logout-button" onClick={logout}>Logout</button>
      <h1 className="dashboard-title">Welcome to ProductiveX 🚀</h1>
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Link to={tool.link} className="tool-box" key={index}>
            <img src={tool.image} alt={tool.name} />
            <h3>{tool.name}</h3>
            <div className="sparkle-overlay" />
          </Link>
        ))}
      </div>
    </div>
  );
}
