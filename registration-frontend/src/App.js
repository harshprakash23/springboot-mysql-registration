import React, { useState } from 'react';
import './App.css';
import UsersList from './UsersList';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [refreshUsers, setRefreshUsers] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ User ${data.name} registered successfully!`);
        setFormData({ name: '', email: '', password: '' });
        // Trigger users list refresh
        setRefreshUsers(prev => prev + 1);
      } else {
        setMessage('❌ Failed to register user.');
      }
    } catch (error) {
      setMessage('❌ Error connecting to backend.');
    }
  };

  return (
    <div className="App">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="btn">Register</button>
      </form>
      {message && <p className="message">{message}</p>}

      <hr style={{ margin: '40px 0' }} />

      {/* Pass refresh trigger to UsersList */}
      <UsersList refreshTrigger={refreshUsers} />
    </div>
  );
}

export default App;