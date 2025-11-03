const express = require('express') 
const router = express.Router() 
const tourController = require('../controllers/tour.controller') 

const { upload, uploadToCloudinary } = require('../../../../shared/middleware/image.middleware')
const { verifyToken, restrictTo } = require('../../../../shared/middleware/auth')

const tourUploadFields = [
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]

const processTourImages = async (req, res, next) => {
  try {
    if (!req.files) return next()
    // Xử lý ảnh bìa
    if (req.files.imageCover) {
      const coverImageFile = req.files.imageCover[0]
      const result = await uploadToCloudinary(coverImageFile.buffer)
      req.body.imageCover = result.secure_url 
    }
    // Xử lý gallery
    if (req.files.images) {
      const urls = await Promise.all(
        req.files.images.map(file => uploadToCloudinary(file.buffer))
      )
      req.body.images = urls.map(result => result.secure_url)
    }
    next()
  } catch (error) {
    next(error)
  }
}
// --- Public routes ---

router.get('/', tourController.getAllTours)

router.get('/:id', tourController.getTourById)

// --- Admin routes ---

router.use(verifyToken, restrictTo('admin'))

router.post(
  '/',
  upload.fields(tourUploadFields), 
  processTourImages,              
  tourController.createTour        
)

router.put(
  '/:id',
  upload.fields(tourUploadFields), 
  processTourImages,
  tourController.updateTour
)

router.delete('/:id', tourController.deleteTour)

module.exports = router



