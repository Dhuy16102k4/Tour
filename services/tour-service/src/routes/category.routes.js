const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const { upload, uploadToCloudinary } = require('../../../../shared/middleware/image.middleware')

const processCategoryIcon = async (req, res, next) => {
  try {
    if (!req.file) return next() 
    const result = await uploadToCloudinary(req.file.buffer)
    req.body.icon = result.secure_url 
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', categoryController.getAllCategories) 

router.get('/:id', categoryController.getCategoryById) 

router.post(
  '/',
  upload.single('icon'), 
  processCategoryIcon,
  categoryController.createCategory
)

module.exports = router 

