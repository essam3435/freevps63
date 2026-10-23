import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (err) {
      setMessage('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`/api/sessions/${sessionId}/revoke`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Session revoked');
      fetchSessions();
    } catch (err) {
      setMessage('❌ Failed to revoke session');
    }
  };

  if (loading) return <div className="container"><div className="spinner"></div></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>📱 Active Sessions</h2>
        </div>

        {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

        {sessions.length === 0 ? (
          <p>No active sessions</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Device</th>
                <th>IP Address</th>
                <th>Created</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>{session.device_name || 'Unknown'}</td>
                  <td>{session.ip_address || 'N/A'}</td>
                  <td>{new Date(session.created_at).toLocaleDateString()}</td>
                  <td>{new Date(session.last_activity).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${session.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {session.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {session.is_active && (
                      <button
                        className="btn btn-danger"
                        onClick={() => revokeSession(session.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sessions;
