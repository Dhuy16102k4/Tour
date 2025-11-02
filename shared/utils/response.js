const successResponse = (res, statusCode = 200, data = null, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  }) 
} 

const errorResponse = (res, statusCode = 500, message = 'Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  }) 
} 

module.exports = {
  successResponse,
  errorResponse
} 

