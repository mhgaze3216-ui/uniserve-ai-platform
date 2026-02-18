import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    marketplace: 0
  });

  useEffect(() => {
    checkApiStatus();
    loadStats();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000');
      setApiStatus('Connected ✅');
    } catch (error) {
      setApiStatus('Disconnected ❌');
    }
  };

  const loadStats = async () => {
    // Placeholder stats - you'll replace these with actual API calls
    setStats({
      users: 150,
      courses: 25,
      marketplace: 45
    });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>UNSER1 Dashboard</h1>
        <div className="api-status">
          API Status: {apiStatus}
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.users}</div>
            <div className="stat-label">Users</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{stats.courses}</div>
            <div className="stat-label">Courses</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-number">{stats.marketplace}</div>
            <div className="stat-label">Marketplace Items</div>
          </div>
        </div>

        <div className="actions-grid">
          <div className="action-card">
            <h3>User Management</h3>
            <p>Manage students and instructors</p>
            <button className="btn-primary">Manage Users</button>
          </div>
          
          <div className="action-card">
            <h3>Course Management</h3>
            <p>Create and manage courses</p>
            <button className="btn-primary">Manage Courses</button>
          </div>
          
          <div className="action-card">
            <h3>Marketplace</h3>
            <p>Manage marketplace items</p>
            <button className="btn-primary">Manage Marketplace</button>
          </div>
          
          <div className="action-card">
            <h3>Reports</h3>
            <p>View system reports and analytics</p>
            <button className="btn-primary">View Reports</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
