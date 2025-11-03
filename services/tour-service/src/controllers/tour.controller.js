const Tour = require('../models/Tour.model')
const { successResponse, errorResponse } = require('../../../../shared/utils/response')

class TourController {
  async getAllTours(req, res, next) {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query
      const query = {}

      if (category) query.category = category
      if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = Number(minPrice)
        if (maxPrice) query.price.$lte = Number(maxPrice)
      }
      if (search) {
        // GÓP Ý: Dùng $text index sẽ nhanh hơn $regex
        // query.$text = { $search: search } (Sau khi đã tạo index 'text' cho name, description)
        
        // Code hiện tại của bạn
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }

      const tours = await Tour.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('category')

      const total = await Tour.countDocuments(query)

      return successResponse(res, 200, {
        tours,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }, 'Tours retrieved successfully')
    } catch (error) {
      console.error('Get tours error:', error)
      return errorResponse(res, 500, 'Error retrieving tours')
    }
  }

  async getTourById(req, res, next) {
    try {
      const { id } = req.params
      const tour = await Tour.findById(id).populate('category')

      if (!tour) {
        return errorResponse(res, 404, 'Tour not found')
      }

      return successResponse(res, 200, { tour }, 'Tour retrieved successfully')
    } catch (error) {
      console.error('Get tour error:', error)
      return errorResponse(res, 500, 'Error retrieving tour')
    }
  }

  async createTour(req, res, next) {
    try {
      // GÓP Ý BẢO MẬT: Nên lọc các trường từ req.body
      // thay vì dùng req.body trực tiếp để tránh Mass Assignment
      const tour = await Tour.create(req.body)
      return successResponse(res, 201, { tour }, 'Tour created successfully')
    } catch (error) {
      console.error('Create tour error:', error)
      return errorResponse(res, 500, 'Error creating tour')
    }
  }

  async updateTour(req, res, next) {
    try {
      const { id } = req.params
      const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })

      if (!tour) {
        return errorResponse(res, 404, 'Tour not found')
      }

      return successResponse(res, 200, { tour }, 'Tour updated successfully')
    } catch (error) {
      console.error('Update tour error:', error)
      return errorResponse(res, 500, 'Error updating tour')
    }
  }

  async deleteTour(req, res, next) {
    try {
      const { id } = req.params
      const tour = await Tour.findByIdAndDelete(id)

      if (!tour) {
        return errorResponse(res, 404, 'Tour not found')
      }

      return successResponse(res, 200, null, 'Tour deleted successfully')
    } catch (error) {
      console.error('Delete tour error:', error)
      return errorResponse(res, 500, 'Error deleting tour')
    }
  }
}

module.exports = new TourController()