import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmail(response.data.email);
    } catch (err) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:5000/api/profile/update',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Email updated successfully');
    } catch (err) {
      setMessage('❌ Failed to update email');
    }
  };

  if (loading) return <div className="container"><div className="spinner"></div></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>👤 Profile Settings</h2>
        </div>

        {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

        <form onSubmit={handleUpdateEmail}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Email</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
