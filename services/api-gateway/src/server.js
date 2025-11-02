const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', timestamp: new Date().toISOString() });
});

// Service URLs
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  tour: process.env.TOUR_SERVICE_URL || 'http://localhost:3002',
  booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:3003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'
};

// Proxy middleware configurations
const createServiceProxy = (target, pathPrefix) => {
  return createProxyMiddleware(pathPrefix, {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${pathPrefix}`]: ''
    },
    onError: (err, req, res) => {
      console.error(`Error proxying to ${target}:`, err.message);
      res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable'
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} ${req.path} to ${target}`);
    }
  });
};

// Routes
app.use('/api/users', createServiceProxy(services.user, '/api/users'));
app.use('/api/tours', createServiceProxy(services.tour, '/api/tours'));
app.use('/api/bookings', createServiceProxy(services.booking, '/api/bookings'));
app.use('/api/payments', createServiceProxy(services.payment, '/api/payments'));
app.use('/api/notifications', createServiceProxy(services.notification, '/api/notifications'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Gateway Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` API Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

