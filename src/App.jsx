import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue || !selectedDomain || !selectedLevel) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/chatbot', {
        inputValue,
        selectedDomain,
        selectedLevel,
      });
      setOutput(response.data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Input:
          <input type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
        </label>
        <br />
        <label>
          Domain:
          <select value={selectedDomain} onChange={(event) => setSelectedDomain(event.target.value)}>
            <option value="">Select a domain</option>
            <option value="domain1">Domain 1</option>
            <option value="domain2">Domain 2</option>
          </select>
        </label>
        <br />
        <label>
          Level:
          <select value={selectedLevel} onChange={(event) => setSelectedLevel(event.target.value)}>
            <option value="">Select a level</option>
            <option value="level1">Level 1</option>
            <option value="level2">Level 2</option>
          </select>
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>Output: {output}</p>
    </div>
  );
}

export default App; 