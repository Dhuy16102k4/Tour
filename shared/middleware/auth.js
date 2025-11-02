const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

const verifyToken = (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
   
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = {
  verifyToken,
  restrictTo
};

