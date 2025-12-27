import React, { useState } from 'react';
import axios from 'axios';
import './QrGenerator.css';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [qrBlobUrl, setQrBlobUrl] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/qr/generate',
        { text },
        { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setQrBlobUrl(imageUrl);
    } catch (err) {
      alert('Failed to generate QR');
    }
  };

  return (
    <div className="qr-page">
      <div className="network-bg"></div>

      <div className="qr-generator-container">
        <h2>QR Code Generator</h2>
        <form onSubmit={handleGenerate}>
          <input
            type="text"
            placeholder="Enter text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit">Generate</button>
        </form>

        {qrBlobUrl && (
          <div className="qr-result">
            <img src={qrBlobUrl} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
}
