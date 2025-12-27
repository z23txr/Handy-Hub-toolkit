import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('PKR');
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(res.data.rates));
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
      }
    };
    fetchCurrencies();
  }, []);

  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/convert', {
        amount,
        from,
        to,
      });
      setResult(res.data.converted);
    } catch (err) {
      console.error(err);
      alert('Conversion failed');
    }
  };

  return (
    <div className="currency-page">
      <div className="network-bg"></div>
      <div className="converter-container">
        <h2>Currency Converter</h2>
        <form onSubmit={handleConvert} className="converter-form">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />

          <div className="currency-group">
            <label htmlFor="from">From</label>
            <select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
              {currencies.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>

          <div className="currency-group">
            <label htmlFor="to">To</label>
            <select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
              {currencies.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>

          <button type="submit">Convert</button>
        </form>

        {result && (
          <div className="converter-result">
            <p><strong>Converted:</strong> {amount} {from} = {result} {to}</p>
          </div>
        )}
      </div>
    </div>
  );
}
