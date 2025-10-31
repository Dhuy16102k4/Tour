const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../../../shared/utils/response');

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, { user }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(res, 500, 'Error retrieving user');
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, { user }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse(res, 500, 'Error retrieving user');
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, { user }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 500, 'Error updating profile');
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await User.findByIdAndDelete(userId);

    return successResponse(res, 200, null, 'Account deleted successfully');
  } catch (error) {
    console.error('Delete account error:', error);
    return errorResponse(res, 500, 'Error deleting account');
  }
};

