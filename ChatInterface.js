import React, { useState } from 'react';

function ChatInterface() {
  const [milestoneCode, setMilestoneCode] = useState('');
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMilestoneCodeInput = event => setMilestoneCode(event.target.value);
  const handleDomainInput = event => setDomain(event.target.value);
  const handleLevelInput = event => setLevel(event.target.value);

  const handleLookup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action: 'lookup', code: milestoneCode })
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setDescription(data.message); // Changed from data.description to data.message
    } catch (error) {
      setError('Failed to send message');
      console.error('There was a problem with your fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListDomain = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action: 'list', domain: domain, level: level })
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setDescription(data.message); // Changed from data to data.message
    } catch (error) {
      setError('Failed to send message');
      console.error('There was a problem with your fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Chat Interface</h1>
      <input
        type="text"
        value={milestoneCode}
        onChange={handleMilestoneCodeInput}
        placeholder="Enter milestone code"
        disabled={loading}
      />
      <button onClick={handleLookup} disabled={loading}>Lookup Milestone</button>
      <br />
      <select
        value={domain}
        onChange={handleDomainInput}
        disabled={loading}
      >
        <option value="">Select Domain</option>
        <option value="Domain 1">Domain 1</option>
        <option value="Domain 2">Domain 2</option>
      </select>
      <select
        value={level}
        onChange={handleLevelInput}
        disabled={loading}
      >
        <option value="">Select Level</option>
        <option value="Level 1">Level 1</option>
        <option value="Level 2">Level 2</option>
      </select>
      <button onClick={handleListDomain} disabled={loading}>List Domain</button>
      <br />
      <p>{description}</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default ChatInterface;
