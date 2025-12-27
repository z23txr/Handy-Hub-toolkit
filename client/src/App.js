import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ✅ Auth & Core Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Dashboard from './pages/Dashboard';

// ✅ Tool Pages
import URLShortener from './pages/URLShortener';
import QrGenerator from './pages/QrGenerator';
import VoiceToText from './pages/VoiceToText';
import ImageCaption from './pages/ImageCaption';
import Weather from './pages/Weather';
import CurrencyConverter from './pages/CurrencyConverter';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/url-shortener"
          element={isAuthenticated ? <URLShortener /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/qr-generator"
          element={isAuthenticated ? <QrGenerator /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/voice-to-text"
          element={isAuthenticated ? <VoiceToText /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/image-caption"
          element={isAuthenticated ? <ImageCaption /> : <Navigate to="/login" replace />}
        />
       <Route
  path="/weather"
  element={isAuthenticated ? <Weather /> : <Navigate to="/login" replace />}
/>

        <Route
          path="/currency-converter"
          element={isAuthenticated ? <CurrencyConverter /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
