import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🔐 Account Manager
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
          <li className="nav-item">
            <Link to="/sessions" className="nav-link">Sessions</Link>
          </li>
          <li className="nav-item">
            <Link to="/security" className="nav-link">Security</Link>
          </li>
          <li className="nav-item">
            <Link to="/activity" className="nav-link">Activity</Link>
          </li>
        </ul>

        <div className="navbar-user">
          <span className="user-name">{user.username}</span>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
