import React, { useState } from 'react';
import axios from 'axios';

function Security() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [twoFAQR, setTwoFAQR] = useState('');
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFACode, setTwoFACode] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/api/password/change',
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage('❌ Failed to change password');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/api/2fa/enable',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTwoFAQR(response.data.qr_code);
      setTwoFASecret(response.data.secret);
      setMessage('💾 Scan the QR code with your authenticator app');
    } catch (err) {
      setMessage('❌ Failed to enable 2FA');
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/api/2fa/confirm',
        { secret: twoFASecret, code: twoFACode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ 2FA enabled successfully');
      setTwoFAQR('');
      setTwoFASecret('');
      setTwoFACode('');
    } catch (err) {
      setMessage('❌ Invalid 2FA code');
    }
  };

  return (
    <div className="container">
      {message && <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      <div className="card">
        <div className="card-header">
          <h2>🔐 Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>🔑 Two-Factor Authentication</h2>
        </div>

        {!twoFAQR ? (
          <button onClick={handleEnable2FA} className="btn btn-primary">Enable 2FA</button>
        ) : (
          <div>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={twoFAQR} alt="2FA QR Code" style={{ maxWidth: '200px', margin: '20px 0' }} />
            <form onSubmit={handleConfirm2FA}>
              <div className="input-group">
                <label>Enter 6-digit code from authenticator</label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Confirm 2FA</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Security;
