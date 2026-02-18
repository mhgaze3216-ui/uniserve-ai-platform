import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>UNSER1</h2>
      </div>
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/users" 
          className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
        >
          Users
        </Link>
        <Link 
          to="/courses" 
          className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}
        >
          Courses
        </Link>
        <Link 
          to="/marketplace" 
          className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}
        >
          Marketplace
        </Link>
        <Link 
          to="/reports" 
          className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
        >
          Reports
        </Link>
      </div>
      <div className="nav-auth">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
};

export default Navigation;
