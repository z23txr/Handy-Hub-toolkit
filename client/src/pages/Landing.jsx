import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const modules = [
  'QR Generator',
  'Weather Forecaster',
  'Image Captioner',
  'Voice to Text',
  'Currency Converter',
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = modules[currentWordIndex];
    const timeout = setTimeout(() => {
      setDisplayedWord(currentWord.slice(0, charIndex + 1));
      if (charIndex === currentWord.length) {
        setTimeout(() => {
          setCharIndex(0);
          setCurrentWordIndex((prev) => (prev + 1) % modules.length);
          setDisplayedWord('');
        }, 1500);
      } else {
        setCharIndex((prev) => prev + 1);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [charIndex, currentWordIndex]);

  return (
    <div className="landing-container">
      <div className="network-bg" /> {/* Animated Grid Background */}

      <img src="/logo.png" alt="Logo" className="logo-top-left sparkle-logo" />

      <div className="landing-left">
        <h1 className="main-heading">Welcome to <span>Handy Hub</span></h1>
        <p className="description">
          Access all essential tools<br />
          Boost productivity with a click<br />
          Everything you need in one place<br />
          Powered by <span className="typing-effect">{displayedWord}</span>
        </p>
        <div className="button-group">
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>

      <div className="landing-right">
        <div className="hero-circle">
         
          <img src="/hero-image.png" alt="Hero" className="hero-img" />
       
        </div>
      </div>
    </div>
  );
}
