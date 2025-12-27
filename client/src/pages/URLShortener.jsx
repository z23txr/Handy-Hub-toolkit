import React, { useState } from 'react';
import axios from 'axios';
import './URLShortener.css'; // Includes animation and styling

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/url/shorten', { originalUrl });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert(err.response?.data?.message || 'Error shortening URL');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  return (
    <div className="url-page">
      <div className="network-bg"></div> {/* ✅ Animated grid background */}
      <div className="url-shortener-container">
        <h2>URL Shortener</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
          <button type="submit">Shorten</button>
        </form>

        {shortUrl && (
          <div className="result">
            <p>
              Shortened URL:{' '}
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl}
              </a>
            </p>
            <button className="copy-btn" onClick={handleCopy}>
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
