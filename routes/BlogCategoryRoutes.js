const express = require('express')
const BlogCategoryRouter = express.Router()
const isAuth = require('../middlewares/isAuth')
const isAdmin = require('../middlewares/isAdmin')
const BlogCategoryController = require('../controllers/BlogCategoryController')
const { uploadPhoto, BlogCategoryImagesResize } = require('../middlewares/uploadImages')


BlogCategoryRouter.post('/AddCategory', isAuth, isAdmin, BlogCategoryController.AddCategory)
BlogCategoryRouter.put('/update/:id', isAuth, isAdmin, BlogCategoryController.UpdateCategory)
BlogCategoryRouter.put('/upload/:id', isAuth, isAdmin, uploadPhoto.single('image'), BlogCategoryImagesResize, BlogCategoryController.uploadImages)
BlogCategoryRouter.get('/categoires', isAuth, isAdmin, BlogCategoryController.GetAllCategory)
BlogCategoryRouter.get('/:id', isAuth, isAdmin, BlogCategoryController.GetACategory)
BlogCategoryRouter.delete('/:id', isAuth, isAdmin, BlogCategoryController.DeleteCategory)




module.exports = BlogCategoryRouter