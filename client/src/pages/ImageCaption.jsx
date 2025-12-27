import React, { useState } from 'react';
import axios from 'axios';
import './ImageCaption.css'; // Ensure this CSS file exists

export default function ImageCaption() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setCaption('');
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/caption/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption(res.data.caption);
    } catch (error) {
      alert('Failed to get caption: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caption-page">
      <div className="network-bg"></div>
      <div className="caption-generator-container">
        <h2>🖼️ Image Caption Generator</h2>

        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleChange} />
          {imagePreview && (
            <div className="preview-container">
              <img src={imagePreview} alt="Preview" className="preview-image" />
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Caption'}
          </button>
        </form>

        {caption && <p className="caption-result">Caption: {caption}</p>}
      </div>
    </div>
  );
}
