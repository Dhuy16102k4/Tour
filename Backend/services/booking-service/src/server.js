const express = require('express') 
const cors = require('cors') 
const helmet = require('helmet') 
const morgan = require('morgan') 
require('dotenv').config() 

const bookingRoutes = require('./routes/booking.routes') 

const app = express() 
const PORT = process.env.PORT || 3003 

app.use(helmet()) 
app.use(cors()) 
app.use(morgan('dev')) 
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Booking Service', timestamp: new Date().toISOString() }) 
}) 

app.use('/api/bookings', bookingRoutes) 

app.use((err, req, res, next) => {
  console.error('Booking Service Error:', err) 
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  }) 
}) 

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  }) 
}) 

app.listen(PORT, () => {
  console.log(`🚀 Booking Service running on port ${PORT}`) 
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`) 
}) 

module.exports = app 

