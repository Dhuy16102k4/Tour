const express = require('express') 
const cors = require('cors') 
const helmet = require('helmet') 
const morgan = require('morgan') 
const cookieParser = require('cookie-parser') 
require('dotenv').config() 

// Import routes and middleware
const userRoutes = require('./routes/user.routes') 
const authRoutes = require('./routes/auth.routes') 
// const globalErrorHandler = require('../shared/errors/errorHandler') 

const app = express() 
const PORT = process.env.PORT || 3001 

// Middleware
app.use(helmet()) 
app.use(cors({ credentials: true, origin: true })) 
app.use(morgan('dev')) 
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser()) 

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'User Service', timestamp: new Date().toISOString() }) 
}) 

// Routes
app.use('/api/users', userRoutes) 
app.use('/api/auth', authRoutes) 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('User Service Error:', err) 
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  }) 
}) 

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  }) 
}) 

// Start server
app.listen(PORT, () => {
  console.log(` User Service running on port ${PORT}`) 
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`) 
}) 

module.exports = app 

