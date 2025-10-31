const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../../../shared/utils/response');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });

    // Remove password from output
    user.password = undefined;

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 201, { user, token }, 'User registered successfully');
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 500, 'Error registering user');
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Remove password from output
    user.password = undefined;

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, { user, token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Error logging in');
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In a microservices architecture, you might want to invalidate the token
    // For now, we'll just return success
    return successResponse(res, 200, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, 500, 'Error logging out');
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    // Implement token refresh logic
    return successResponse(res, 200, null, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(res, 500, 'Error refreshing token');
  }
};

