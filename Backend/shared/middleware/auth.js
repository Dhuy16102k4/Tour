const jwt = require('jsonwebtoken') 
const AppError = require('../errors/AppError') 
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key'


const verifyToken = (req, res, next) => {
  try {
    let token 
    
    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
   
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }
    // Verify token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded 
    next() 
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401)) 
  }
} 

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403)) 
    }
    next() 
  } 
} 

module.exports = {
  verifyToken,
  restrictTo
} 

