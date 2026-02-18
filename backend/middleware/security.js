const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// General rate limiting
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limiters for different endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many authentication attempts, please try again later'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again later'
);

const uploadLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 uploads per window
  'Too many upload attempts, please try again later'
);

const apiLimiter = createRateLimiter(
  1 * 60 * 1000, // 1 minute
  1000, // 1000 requests per window
  'Too many API requests, please try again later'
);

// Security headers configuration
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// CORS configuration
const corsConfig = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://uniserve-ai.vercel.app',
      'https://uniserve-ai.herokuapp.com'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
});

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];

  const checkSuspicious = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(obj[key])) {
            return false;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (!checkSuspicious(obj[key])) {
          return false;
        }
      }
    }
    return true;
  };

  if (!checkSuspicious(req.body) || !checkSuspicious(req.query)) {
    return res.status(400).json({ message: 'Invalid request detected' });
  }

  next();
};

// IP blocking middleware
const blockedIPs = new Set();
const suspiciousCounts = new Map();

const blockIP = (ip) => {
  blockedIPs.add(ip);
  suspiciousCounts.delete(ip);
  console.log(`IP ${ip} has been blocked`);
};

const ipBlocker = (req, res, next) => {
  const clientIP = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0]?.trim();

  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // After response finishes check for 401/403 and count suspicious events per IP
  res.on('finish', () => {
    try {
      const status = res.statusCode;
      if (status === 401 || status === 403) {
        const prev = suspiciousCounts.get(clientIP) || 0;
        const nextCount = prev + 1;
        suspiciousCounts.set(clientIP, nextCount);
        if (nextCount >= 5) {
          blockIP(clientIP);
        }
      } else {
        // decay suspicious count slowly on successful responses
        if (suspiciousCounts.has(clientIP)) {
          const newCount = Math.max((suspiciousCounts.get(clientIP) || 1) - 1, 0);
          if (newCount === 0) suspiciousCounts.delete(clientIP); else suspiciousCounts.set(clientIP, newCount);
        }
      }
    } catch (e) {
      console.error('ipBlocker finish handler error:', e);
    }
  });

  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.get('content-length');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({ message: 'Request entity too large' });
  }

  next();
};

// API key validation for sensitive endpoints
const validateAPIKey = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    return next(); // Skip validation if no API key is configured
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();
};

// Session security
const sessionSecurity = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

module.exports = {
  authLimiter,
  generalLimiter,
  uploadLimiter,
  apiLimiter,
  helmetConfig,
  corsConfig,
  validateRequest,
  ipBlocker,
  requestSizeLimiter,
  validateAPIKey,
  sessionSecurity,
  blockIP
};
