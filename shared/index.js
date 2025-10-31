// Export all shared utilities for easy imports

module.exports = {
  // Database
  MongoDB: require('./database/mongodb'),
  RedisClient: require('./database/redis'),
  
  // Errors
  AppError: require('./errors/AppError'),
  errorHandler: require('./errors/errorHandler'),
  
  // Middleware
  verifyToken: require('./middleware/auth').verifyToken,
  restrictTo: require('./middleware/auth').restrictTo,
  asyncHandler: require('./middleware/asyncHandler'),
  
  // Utils
  successResponse: require('./utils/response').successResponse,
  errorResponse: require('./utils/response').errorResponse,
  logger: require('./utils/logger')
};

