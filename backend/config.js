const dotenv = require('dotenv');

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  nodeEnv: NODE_ENV,
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI || (NODE_ENV === 'test' ? 'mongodb://localhost:27017/unser1_test' : 'mongodb://localhost:27017/unser1'),
  mongodbUriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/unser1_test',
  jwtSecret: process.env.JWT_SECRET || (NODE_ENV === 'test' ? 'test_jwt_secret' : 'dev_jwt_secret'),
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || '"UniServe AI" <noreply@uniserve.ai>'
  }
};

// In production, require critical secrets
if (config.nodeEnv === 'production') {
  if (!config.jwtSecret) throw new Error('JWT_SECRET is required in production');
  if (!config.mongodbUri) throw new Error('MONGODB_URI is required in production');
}

module.exports = config;
