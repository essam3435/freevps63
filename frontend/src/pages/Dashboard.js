import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);

      const sessionsRes = await axios.get('http://localhost:5000/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const activitiesRes = await axios.get('http://localhost:5000/api/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats({
        activeSessions: sessionsRes.data.filter(s => s.is_active).length,
        totalSessions: sessionsRes.data.length,
        recentActivity: activitiesRes.data.length
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p>Here's your account overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔓</div>
          <div className="stat-content">
            <h3>Active Sessions</h3>
            <p className="stat-value">{stats.activeSessions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>Total Sessions</h3>
            <p className="stat-value">{stats.totalSessions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Recent Activity</h3>
            <p className="stat-value">{stats.recentActivity}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔐</div>
          <div className="stat-content">
            <h3>Security Status</h3>
            <p className="stat-value">{user?.is_2fa_enabled ? 'Protected' : 'Enable 2FA'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="card">
          <div className="card-header">
            <h2>Account Information</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Username</label>
              <p>{user?.username}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Account Created</label>
              <p>{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>Last Login</label>
              <p>{user?.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
