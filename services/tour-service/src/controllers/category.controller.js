const Category = require('../models/Category.model');
const { successResponse, errorResponse } = require('../../../shared/utils/response');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return successResponse(res, 200, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 500, 'Error retrieving categories');
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    return successResponse(res, 200, { category }, 'Category retrieved successfully');
  } catch (error) {
    console.error('Get category error:', error);
    return errorResponse(res, 500, 'Error retrieving category');
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return successResponse(res, 201, { category }, 'Category created successfully');
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse(res, 500, 'Error creating category');
  }
};

