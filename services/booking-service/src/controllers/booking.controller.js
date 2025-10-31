const Booking = require('../models/Booking.model');
const { successResponse, errorResponse } = require('../../../shared/utils/response');
const axios = require('axios');

const TOUR_SERVICE_URL = process.env.TOUR_SERVICE_URL || 'http://localhost:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    return successResponse(res, 200, {
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Bookings retrieved successfully');
  } catch (error) {
    console.error('Get bookings error:', error);
    return errorResponse(res, 500, 'Error retrieving bookings');
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    return successResponse(res, 200, { booking }, 'Booking retrieved successfully');
  } catch (error) {
    console.error('Get booking error:', error);
    return errorResponse(res, 500, 'Error retrieving booking');
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { tourId, userId, numberOfGuests, startDate, totalAmount } = req.body;

    // Verify tour exists and has availability
    try {
      const tourResponse = await axios.get(`${TOUR_SERVICE_URL}/api/tours/${tourId}`);
      const tour = tourResponse.data.data.tour;
      
      if (numberOfGuests > tour.maxCapacity) {
        return errorResponse(res, 400, 'Exceeds maximum capacity');
      }
    } catch (error) {
      return errorResponse(res, 400, 'Tour not found or unavailable');
    }

    // Create booking
    const booking = await Booking.create({
      tourId,
      userId,
      numberOfGuests,
      startDate,
      totalAmount,
      status: 'pending'
    });

    // Create payment
    try {
      await axios.post(`${PAYMENT_SERVICE_URL}/api/payments`, {
        bookingId: booking._id,
        userId,
        amount: totalAmount
      });
    } catch (error) {
      console.error('Payment creation error:', error);
    }

    // Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId,
        type: 'booking_confirmation',
        message: 'Your booking has been created successfully'
      });
    } catch (error) {
      console.error('Notification sending error:', error);
    }

    return successResponse(res, 201, { booking }, 'Booking created successfully');
  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse(res, 500, 'Error creating booking');
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    return successResponse(res, 200, { booking }, 'Booking updated successfully');
  } catch (error) {
    console.error('Update booking error:', error);
    return errorResponse(res, 500, 'Error updating booking');
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, {
      new: true
    });
    
    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    // Send notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId: booking.userId,
        type: 'booking_cancellation',
        message: 'Your booking has been cancelled'
      });
    } catch (error) {
      console.error('Notification sending error:', error);
    }

    return successResponse(res, 200, { booking }, 'Booking cancelled successfully');
  } catch (error) {
    console.error('Cancel booking error:', error);
    return errorResponse(res, 500, 'Error cancelling booking');
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    return successResponse(res, 200, { bookings }, 'User bookings retrieved successfully');
  } catch (error) {
    console.error('Get user bookings error:', error);
    return errorResponse(res, 500, 'Error retrieving user bookings');
  }
};

