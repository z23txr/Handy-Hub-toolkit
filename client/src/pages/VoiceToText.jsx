import React, { useState } from 'react';
import axios from 'axios';
import './VoiceToText.css';

export default function VoiceToText() {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    try {
      const res = await axios.post('http://localhost:5000/api/speech-to-text', formData);
      setText(res.data.text);
      setError('');
    } catch (err) {
      console.error('Transcription error:', err);
      setText('');
      setError('❌ File is empty or you didn’t speak anything.');
    }
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecording(false);
        setAudioBlob(blob);
        handleFileUpload(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } else {
      setTimeout(() => {
        mediaRecorder.stop();
      }, 500); // short delay to capture final chunk
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioBlob(file);
      handleFileUpload(file);
    }
  };

  return (
    <div className="voice-page">
      <div className="network-bg"></div>
      <div className="voice-container">
        <h2>🎙️ Voice to Text</h2>
        <p>Upload audio or record using microphone</p>

        <input type="file" accept="audio/*" onChange={handleFileChange} />

        <button onClick={handleRecord}>
          {recording ? '🛑 Stop Recording' : '🎤 Record from Mic'}
        </button>

        {audioBlob && (
          <div className="player">
            <h4>🎧 Your Recording:</h4>
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
        )}

        {text && (
          <div className="result">
            <h4>📝 Transcription:</h4>
            <p>{text}</p>
          </div>
        )}

        {error && (
          <div className="error">
            <h4>⚠️ Notice:</h4>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
