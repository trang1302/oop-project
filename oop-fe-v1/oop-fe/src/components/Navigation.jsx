import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout, hasRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="logo">Book Management</div>
      
      <div className="nav-links">
        {currentUser ? (
          <>
            <Link to="/books">Books</Link>
            <Link to="/upload">Upload Book</Link>
            {hasRole('ADMIN') && <Link to="/admin">Admin Panel</Link>}
            <span className="user-info">
              Logged in as: {currentUser.username}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;