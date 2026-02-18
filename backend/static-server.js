const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'UNSER1 Backend API is running' });
});

// Auth API Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication (in production, use real database)
  if (email && password) {
    const user = {
      id: '1',
      name: email.split('@')[0] || 'User',
      email: email
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: user
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Simple mock registration (in production, use real database)
  if (email && password && name) {
    const user = {
      id: '1',
      name: name,
      email: email
    };
    
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      success: true,
      message: 'Registration successful',
      token: token,
      user: user
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/register.html'));
});

app.get('/education', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/education.html'));
});

app.get('/marketplace', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/marketplace.html'));
});

app.get('/cybersecurity', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/cybersecurity.html'));
});

app.get('/consultation', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/consultation.html'));
});

app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/showcase.html'));
});

// Auth API endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // TODO: Implement actual authentication logic
  res.json({ 
    success: true, 
    message: 'Login successful',
    token: 'dummy-jwt-token',
    user: { email, name: 'User Name' }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  // TODO: Implement actual registration logic
  res.json({ 
    success: true, 
    message: 'Registration successful',
    user: { email, name }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
