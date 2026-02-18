import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';

// Placeholder components - سننشئها لاحقاً
const Users = () => <div><h1>User Management</h1><p>Manage students and instructors</p></div>;
const Courses = () => <div><h1>Course Management</h1><p>Create and manage courses</p></div>;
const Marketplace = () => <div><h1>Marketplace</h1><p>Manage marketplace items</p></div>;
const Reports = () => <div><h1>Reports</h1><p>View system reports and analytics</p></div>;
const Login = () => <div><h1>Login</h1><p>User authentication</p></div>;
const Register = () => <div><h1>Register</h1><p>Create new account</p></div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
