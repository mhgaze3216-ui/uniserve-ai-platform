# UNSER1 Backend API

Complete backend solution for the UNSER1 University Management System with AI consultation, education, and marketplace features.

## Features

- **Authentication**: User registration, login, and profile management
- **Consultation Services**: AI-powered consultations in business, technology, healthcare, and legal fields
- **Education System**: Course enrollment, reviews, and management
- **Marketplace**: Buy/sell items with reviews and ratings
- **Real-time Chat**: WebSocket support for live consultations
- **Security**: JWT authentication, rate limiting, input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unser1
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start MongoDB (make sure it's running on your system)

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Consultation
- `POST /api/consultation/start` - Start new consultation
- `GET /api/consultation/my-consultations` - Get user's consultations
- `GET /api/consultation/:id` - Get specific consultation
- `POST /api/consultation/:id/message` - Send message
- `PUT /api/consultation/:id/complete` - Complete consultation
- `DELETE /api/consultation/:id` - Cancel consultation

### Education
- `GET /api/education/courses` - Get all courses
- `GET /api/education/courses/:id` - Get specific course
- `POST /api/education/courses/:id/enroll` - Enroll in course
- `GET /api/education/my-courses` - Get user's enrolled courses
- `POST /api/education/courses/:id/review` - Review course
- `GET /api/education/categories` - Get course categories

### Marketplace
- `GET /api/marketplace/items` - Get marketplace items
- `GET /api/marketplace/items/:id` - Get specific item
- `POST /api/marketplace/items` - Create new item
- `PUT /api/marketplace/items/:id` - Update item
- `POST /api/marketplace/items/:id/like` - Like/unlike item
- `POST /api/marketplace/items/:id/review` - Review item
- `GET /api/marketplace/my-items` - Get user's items
- `DELETE /api/marketplace/items/:id` - Delete item
- `GET /api/marketplace/categories` - Get item categories

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get specific user

## WebSocket Events

### Client to Server
- `join-consultation` - Join consultation room
- `send-message` - Send chat message

### Server to Client
- `receive-message` - Receive chat message

## Database Models

### User
- username, email, password
- firstName, lastName, avatar
- role (student/instructor/admin)
- enrolledCourses, consultations

### Consultation
- user, field, title, status
- messages (sender, content, timestamp)
- startTime, endTime, rating, feedback

### Course
- title, description, category
- price, duration, location
- instructor, enrolledStudents
- rating, reviews, tags

### MarketplaceItem
- title, description, category, price
- seller, images, condition
- availability, views, likes
- reviews, tags

## Security Features

- JWT authentication with expiration
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration
- Helmet for security headers

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "errors": [] // Validation errors (if applicable)
}
```

## Development

### Adding New Routes
1. Create model in `models/` directory
2. Create route file in `routes/` directory
3. Add route to `server.js`
4. Add authentication middleware if needed

### Database Seeding
You can create a seed script to populate the database with initial data:
```javascript
// scripts/seed.js
const User = require('../models/User');
const Course = require('../models/Course');
// ... add seed data
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB with authentication
4. Set up reverse proxy (nginx)
5. Enable HTTPS
6. Configure environment variables properly

## License

MIT License
