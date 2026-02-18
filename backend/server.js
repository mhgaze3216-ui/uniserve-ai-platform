const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const config = require('./config');
const { connectDB } = require('./utils/database');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { 
  helmetConfig, 
  corsConfig, 
  generalLimiter, 
  authLimiter,
  validateRequest,
  ipBlocker,
  requestSizeLimiter,
  sessionSecurity,
  uploadLimiter
} = require('./middleware/security');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ["GET", "POST"]
  }
});

const ChatRoom = require('./models/ChatRoom');

const PORT = config.port;

// Security middleware
app.use(helmetConfig);
app.use(corsConfig);
app.use(sessionSecurity);
app.use(validateRequest);
app.use(ipBlocker);
app.use(requestSizeLimiter);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(require('express-mongo-sanitize')());
app.use(require('xss-clean')());
app.use(require('hpp')());

// MongoDB connection is handled by utils/database.connectDB

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniServe AI API',
      version: '1.0.0',
      description: 'Complete API documentation for UniServe AI platform',
      contact: {
        name: 'API Support',
        email: 'support@uniserve.ai'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://uniserve-api.herokuapp.com' 
          : 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/consultation', require('./routes/consultation'));
app.use('/api/education', require('./routes/education'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', uploadLimiter, require('./routes/upload'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));

// Payment routes
app.use('/api/payments', require('./routes/payments'));

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

// Serve the simplified consultation test page
app.get('/consultation-simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/consultation-simple.html'));
});

app.get('/showcase', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/showcase.html'));
});

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'UniServe AI Backend API is running with MongoDB',
    version: '2.0.0',
    features: {
      authentication: true,
      payments: true,
      email: true,
      analytics: true,
      realTime: true,
      security: true
    }
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-consultation', (consultationId) => {
    socket.join(consultationId);
    console.log(`User ${socket.id} joined consultation ${consultationId}`);
    // Emit existing history for this room if any
    (async () => {
      try {
        const room = await ChatRoom.findOne({ roomId: consultationId });
        if (room && room.messages && room.messages.length) {
          socket.emit('chat-history', { roomId: consultationId, messages: room.messages });
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    })();
  });

  socket.on('send-message', (data) => {
    try {
      const roomId = data.consultationId;
      const content = data.message || data.text || '';
      const sender = data.sender || 'user';

      // Persist message to ChatRoom (create if not exists)
      (async () => {
        try {
          let room = await ChatRoom.findOne({ roomId });
          if (!room) {
            room = new ChatRoom({ roomId, messages: [] });
          }
          await room.addMessage(sender, content);
        } catch (err) {
          console.error('Failed to persist chat message', err);
        }
      })();

      // Broadcast to others in room
      socket.to(roomId).emit('receive-message', { roomId, sender, message: content, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error('send-message handler error', err);
    }
  });

  socket.on('join-admin-room', () => {
    socket.join('admin-room');
    console.log(`Admin ${socket.id} joined admin room`);
  });

  socket.on('new-order', (orderData) => {
    io.to('admin-room').emit('new-order-notification', orderData);
  });

  socket.on('user-activity', (userData) => {
    socket.broadcast.emit('user-activity-update', userData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value' });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

if (require.main === module) {
  // If this file is run directly, connect DB and start server
  connectDB();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🔗 Frontend: http://localhost:${PORT}`);
  });
}

// Export server as default and attach app and io
module.exports = server;
module.exports.app = app;
module.exports.io = io;
