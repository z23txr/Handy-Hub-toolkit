import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      alert('Please enter a city name.');
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await axios.post('http://localhost:5000/api/weather', { city });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1 className="weather-title">10-Day Weather Forecast</h1>

      <div className="weather-form">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {data && !loading && (
        <div className="weather-results fade-in">
          <div className="current-weather">
            <h2>{data.current.city}, {data.current.country}</h2>
            <p>{data.current.description}</p>
            <p>{data.current.temperature}°C</p>
            <img src={data.current.icon} alt="weather-icon" />
          </div>

          <div className="forecast">
            {data.forecast.map((day, index) => (
              <div className="forecast-day" key={index}>
                <h4>{day.date}</h4>
                <img src={day.icon} alt="icon" />
                <p>{day.condition}</p>
                <p>{day.avg_temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
