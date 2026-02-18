const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const config = require('./config');
const io = socketIo(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"]
  }
});

const PORT = config.port;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(config.mongodbUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/consultation', require('./routes/consultation'));
app.use('/api/education', require('./routes/education'));
app.use('/api/marketplace', require('./routes/marketplace'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'static')));

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

app.get('/marketplace', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/marketplace.html'));
});

app.get('/consultation', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/consultation.html'));
});

app.get('/education', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/education.html'));
});

app.get('/cybersecurity', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/cybersecurity.html'));
});

app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/showcase.html'));
});

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'UniServe AI Backend API is running with MongoDB',
    version: '2.0.0'
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-consultation', (consultationId) => {
    socket.join(consultationId);
    console.log(`User ${socket.id} joined consultation ${consultationId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.consultationId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Frontend: http://localhost:${PORT}`);
});
