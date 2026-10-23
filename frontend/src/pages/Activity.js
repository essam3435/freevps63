import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/api/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (err) {
      console.error('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><div className="spinner"></div></div>;

  const getActionIcon = (action) => {
    const icons = {
      'login': '🔓',
      'logout': '🚪',
      'password_changed': '🔑',
      'profile_updated': '👤',
      '2fa_enabled': '🔐',
      '2fa_disabled': '🔓',
      'session_revoked': '❌',
      'account_created': '✨'
    };
    return icons[action] || '📝';
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>📊 Activity Log</h2>
        </div>

        {activities.length === 0 ? (
          <p>No activity recorded</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>
                    <span style={{ marginRight: '8px' }}>{getActionIcon(activity.action)}</span>
                    {activity.action.replace(/_/g, ' ').toUpperCase()}
                  </td>
                  <td>{activity.details || '-'}</td>
                  <td>{activity.ip_address || 'N/A'}</td>
                  <td>{new Date(activity.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Activity;
